import { defaultsDeep, isArray, merge } from 'lodash-es';
import { AnFormProps, FormUseOptions, AnFormItemProps, FormItem, useItems } from '@/components/AnForm';

export type ExtendFormItem = Partial<
  FormItem & {
    /**
     * 从新建弹窗继承表单项
     * @example
     * ```ts
     * 'name'
     * ```
     */
    extend: string;
  }
>;

type SearchFormItem = ExtendFormItem & {
  /**
   * 是否点击图标后进行搜索
   * @default
   * ```ts
   * false
   * ```
   */
  searchable?: boolean;
  /**
   * 是否回车后进行查询
   * @default
   * ```ts
   * false
   * ```
   */
  enterable?: boolean;
};

export type SearchFormObject = Omit<FormUseOptions, 'items' | 'submit'> & {
  /**
   * 搜索表单项
   * @example
   * ```ts
   * [{
   *   extend: 'name' // 从 create.items 继承
   * }]
   * ```
   */
  items?: SearchFormItem[];
  /**
   * 是否隐藏查询按钮
   * @default
   * ```tsx
   * false
   * ```
   */
  hideSearch?: boolean;
};

export type SearchForm = SearchFormObject | SearchFormItem[];

export function useSearchForm(search?: SearchForm, extendItems: AnFormItemProps[] = []): AnFormProps | undefined {
  if (!search) {
    return undefined;
  }

  if (isArray(search)) {
    search = { items: search };
  }

  const { items: _items = [], hideSearch, model: _model, formProps: _formProps } = search;
  const extendMap = extendItems.reduce((m, v) => ((m[v.field] = v), m), {} as Record<string, AnFormItemProps>);

  const props = {
    items: [] as AnFormItemProps[],
    model: _model ?? {},
    formProps: defaultsDeep({}, _formProps, { layout: 'inline' }),
  };

  const defualts: Partial<AnFormItemProps> = {
    setter: 'input',
    itemProps: {
      hideLabel: true,
    },
    setterProps: {},
  };

  const items: AnFormItemProps[] = [];
  for (const _item of _items) {
    const { searchable, enterable, field, extend, ...itemRest } = _item;
    if ((field || extend) === 'submit' && hideSearch) {
      continue;
    }
    let item: AnFormItemProps = defaultsDeep({}, itemRest, defualts);
    if (extend) {
      const extendItem = extendMap[extend];
      if (extendItem) {
        item = merge({}, extendItem, itemRest);
      }
    }
    if (searchable) {
      (item as any).setterProps.onSearch = () => null;
    }
    if (enterable) {
      (item as any).setterProps.onPressEnter = () => null;
    }
    if (item.setterProps) {
      (item.setterProps as any).placeholder = (item.setterProps as any).placeholder ?? item.label;
    }
    items.push(item);
  }

  props.items = useItems(items, props.model);

  return props;
}
