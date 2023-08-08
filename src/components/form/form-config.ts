export const config = {
  /**
   * 获取API错误信息
   */
  getApiErrorMessage(error: any) {
    return error?.response?.data?.message || error?.message || "Error";
  },
  /**
   * 设置表单数据
   */
  setModel: function setModel(model: any, data: any) {
    for (const key of Object.keys(model)) {
      // 数组类型
      if (/^\[.+\]$/.test(key)) {
        const subkeysStr = key.replaceAll(/\s/g, "").match(/^\[(.+)\]$/)?.[1];
        if (!subkeysStr) {
          model[key] = data[key];
          continue;
        }
        const subkeys = subkeysStr.split(",");
        const value = new Array(subkeys.length);
        subkeys.forEach((subkey, index) => {
          if (/.+:number$/.test(subkey)) {
            subkey = subkey.replace(/:number$/, "");
            value[index] = Number(data[subkey]);
            return;
          }
          if (/.+:boolean$/.test(subkey)) {
            subkey = subkey.replace(/:boolean$/, "");
            value[index] = Boolean(data[subkey]);
            return;
          }
          value[index] = data[subkey];
        });
        model[key] = value;
        continue;
      }
      // 默认类型
      model[key] = data[key];
    }
    return model;
  },
  /**
   * 获取表单数据
   */
  getModel: function getModel(model: Record<string, any>) {
    const data: any = {};
    for (const [key, val] of Object.entries(model)) {
      // 数组类型
      if (/^\[.+\]$/.test(key)) {
        const subkeysStr = key.replaceAll(/\s/g, "").match(/^\[(.+)\]$/)?.[1];
        if (!subkeysStr) {
          data[key] = val;
          continue;
        }
        const subkeys = subkeysStr.split(",");
        subkeys.forEach((subkey, index) => {
          if (/(.+)?:number$/.test(subkey)) {
            subkey = subkey.replace(/:number$/, "");
            data[subkey] = val?.[index] && Number(val[index]);
            return;
          }
          if (/(.+)?:boolean$/.test(subkey)) {
            subkey = subkey.replace(/:boolean$/, "");
            data[subkey] = val?.[index] && Boolean(val[index]);
            return;
          }
          data[subkey] = val?.[index];
        });
        continue;
      }
      // 默认类型
      data[key] = val;
    }
    return data;
  },
};