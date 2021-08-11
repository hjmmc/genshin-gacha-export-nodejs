# 原神抽卡记录导出工具（NodeJS版）

特此声明：本工具部分代码复制于 [sunfkny/genshin-gacha-export-js](https://github.com/sunfkny/genshin-gacha-export-js)，侵删

## URL 获取方式

> 主要是需要获取 authky，这相当于用户身份信息，目前可以做啥还不清楚，不排除可以重置密码等操作，建议别泄露到其它地方。本工具纯本地运行，不会收集任何用户信息。

### IOS 和 PC 用户：

依次点击：派蒙头像->游戏反馈->账号问题->历史设备临时处理->通行证账号关联  
最后把浏览器的 URL 全选复制粘贴到程序回车即可

### Android 用户：

> Android 讲道理也可以用上述方式获取，没机器测试，有人试过可以反馈下

打开游戏祈愿->历史记录->断网后刷新  
最后把页面出现的 URL 全选复制粘贴到程序回车即可

## 使用方式

1. 下载编译后程序文件，双击运行  
2. 把上个步骤获取的 URL 粘贴后回车
3. 程序自动获取抽卡记录并导出为 Excel 表
4. 最后可以把抽卡记录上传至 [原神抽卡记录分析工具](https://voderl.github.io/genshin-gacha-analyzer/) 进行分析

## 鸣谢

1. [sunfkny/genshin-gacha-export](https://github.com/sunfkny/genshin-gacha-export)
2. [sunfkny/genshin-gacha-export-js](https://github.com/sunfkny/genshin-gacha-export-js)