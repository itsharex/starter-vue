<template>
  <AnPage>
    <LoginLogTable>
      <template #action>
        <a-button type="primary" @click="visible = true">
          <template #icon>
            <i class="i-icon-park-outline-add"></i>
          </template>
          添加
        </a-button>
      </template>
    </LoginLogTable>
  </AnPage>
</template>

<script setup lang="tsx">
import { useUserStore } from '@/store/userStore';
import { TableColumnData } from '@arco-design/web-vue';
import { useTable } from 'arconify';
import dayjs from 'dayjs';

defineOptions({
  name: 'SystemLoglPage',
});

definePage({
  meta: {
    title: '登陆日志',
    icon: 'i-icon-park-outline-log',
    componentName: 'SystemLoglPage',
    sort: 10303,
    auth: 'log_auth_page'
  },
});

const visible = ref(false);
const userStore = useUserStore()

"userStore.auths.log_auth_page"

const useTwoRowsColumn = (tkey: string, bkey: string): TableColumnData['render'] => {
  return ({ record }) => {
    return (
      <div class="flex flex-col overflow-hidden">
        <span>{record[tkey] || '未知'}</span>
        <span class="text-gray-400 text-xs truncate">{record[bkey]}</span>
      </div>
    );
  };
};

const LoginLogTable = useTable({
  data: async model => {
    return [];
  },
  columns: [
    {
      title: '操作描述',
      dataIndex: 'description',
      render: ({ record }) => {
        return (
          <div class="flex items-center gap-2">
            <span
              class={
                record.status === null || record.status ? 'text-base text-green-500 i-icon-park-outline-check-one mr-2' : 'text-base text-red-500 i-icon-park-outline-close-one mr-2'
              }
            ></span>
            <div>
              <div>{record.description}</div>
              <div class="text-xs text-gray-400">用户：{record.nickname}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '登陆地址',
      dataIndex: 'ip',
      width: 200,
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      width: 200,
      render({ record }) {
        const [os, version] = record.os.split(' ');
        return (
          <div class="flex flex-col overflow-hidden">
            <span>{os || '未知'}</span>
            <span class="text-gray-400 text-xs truncate">{version}</span>
          </div>
        );
      },
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      width: 200,
      render({ record }) {
        const [browser, version] = record.browser.split(' ');
        return (
          <div class="flex flex-col overflow-hidden">
            <span>{browser || '未知'}</span>
            <span class="text-gray-400 text-xs truncate">v{version}</span>
          </div>
        );
      },
    },
    {
      title: '登陆时间',
      dataIndex: 'createAt',
      width: 200,
      render({ record }) {
        return (
          <div class="flex flex-col overflow-hidden">
            <span>{dayjs(record.createdAt).fromNow()}</span>
            <span class="text-gray-400 text-xs truncate">{dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
          </div>
        );
      },
    },
  ],
  search: [
    {
      field: '[startDate, endDate]',
      label: '登陆账号',
      setter: 'dateRange',
      setterProps: {
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        timePickerProps: { defaultValue: ['23:59:59', '00:00:00'] },
      },
    },
    {
      field: 'nickname',
      label: '登陆账号',
      setter: 'search',
    },
  ],
});
</script>

<style scoped></style>
