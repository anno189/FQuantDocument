# Notification 架构文档

**模块路径**: `FQBase.Core.notification`
**源码**: [notification.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/notification.py)

---

## 一、整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        应用层代码                                │
│   NotificationManager().send(), sendWechat(), etc.             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   NotificationManager (单例)                     │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                  _handlers: Dict[str, Handler]           │ │
│  │  wecom_default → WecomHandler                           │ │
│  │  wecom_bond → WecomHandler                              │ │
│  │  serverchan → ServerChanHandler                         │ │
│  │  pushbear → PushBearHandler                             │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
            │                    │                    │
            ▼                    ▼                    ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ WecomHandler   │    │ServerChanHandler│    │PushBearHandler  │
│  ────────────── │    │  ────────────── │    │  ────────────── │
│ 企业微信 API     │    │ Server 酱 API   │    │ PushBear API    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 二、组件架构

```
NotificationManager (单例)
├── _handlers: Dict[str, NotificationHandler]
│       ├── wecom_default: WecomHandler
│       ├── wecom_bond: WecomHandler
│       ├── ...
│       ├── wecom_system: WecomHandler
│       ├── serverchan: ServerChanHandler
│       └── pushbear: PushBearHandler
│
└── _write_lock: threading.Lock

NotificationHandler (基类)
├── WecomHandler
│       ├── channel: str
│       └── client: AppMsgSender
│
├── ServerChanHandler
│       ├── serverchan_key: str
│       └── api_url: str
│
└── PushBearHandler
        ├── send_key: str
        └── api_url: str
```

---

## 三、发送流程

```
NotificationManager.send(content, channel='DEFAULT')
                │
                ▼
┌───────────────────────────────┐
│ 获取处理器                    │
│ handler = _handlers.get(     │
│   f'wecom_{channel.lower()}')│
└───────────────────────────────┘
                │
                ▼
┌───────────────────────────────┐
│ 调用处理器 send()             │
└───────────────────────────────┘
                │
                ▼
┌───────────────────────────────┐
│ 企业微信/Server酱/PushBear API │
└───────────────────────────────┘
```
