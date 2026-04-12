# NotificationTemplate 最佳实践

**模块路径**: `FQBase.Core.notification_template`
**源码**: [notification_template.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/notification_template.py)

---

## 一、模板变量规范

```python
# 推荐：使用简洁的变量名
NotificationTemplate.render('trade_signal',
    strategy='均值回归',
    code='000001',
    price=12.50,
    time='2024-01-15 10:30:00'
)

# 不推荐：过长的变量名
NotificationTemplate.render('trade_signal',
    strategy_name='均值回归策略',
    stock_code='000001',
    current_price=12.50
)
```

---

## 二、错误处理

```python
from FQBase.Core.notification_template import NotificationTemplate

def safe_render(template_name: str, **kwargs) -> str:
    result = NotificationTemplate.render(template_name, **kwargs)
    if result.startswith('[Template Error'):
        return None
    return result

def safe_render_dict(template_name: str, **kwargs) -> dict:
    result = NotificationTemplate.render_dict(template_name, **kwargs)
    if 'error' in result:
        return None
    return result
```

---

## 三、动态模板级别

```python
from FQBase.Core.notification_template import NotificationTemplate
from FQBase.Core.notification import NotificationManager

def send_with_level(template_name: str, level: str = None, **kwargs):
    template = NotificationTemplate.get(template_name)
    if template is None:
        return False

    effective_level = level or template.level

    if effective_level == 'error':
        channel = 'SYSTEM'
    elif effective_level == 'warning':
        channel = 'HIGH'
    else:
        channel = 'DEFAULT'

    message = template.render(**kwargs)
    NotificationManager().send(message, channel=channel)
```

---

## 四、批量通知

```python
from FQBase.Core.notification_template import NotificationTemplate
from FQBase.Core.notification import NotificationManager

def send_batch_notifications(template_name: str, items: list):
    manager = NotificationManager()
    template = NotificationTemplate.get(template_name)

    if template is None:
        return

    for item in items:
        message = template.render(**item)
        manager.send(message)

def send_trade_signals(signals: list):
    for signal in signals:
        message = NotificationTemplate.render('trade_signal', **signal)
        sendWechat(message, channel='DEFAULT')
```

---

## 五、自定义模板工厂

```python
from FQBase.Core.notification_template import NotificationTemplate

def create_alert_template(name: str, title: str, body_template: str, level: str = 'info'):
    return NotificationTemplate(
        name=name,
        title=title,
        body_template=body_template,
        level=level
    )

price_alert = create_alert_template(
    name='price_alert',
    title='【价格告警】',
    body_template='标的: {code}\n当前价: {price}\n阈值: {threshold}',
    level='warning'
)

NotificationTemplate.register(price_alert)
```

---

## 六、维护事宜

### 6.1 添加新模板

当需要新增通知模板时，推荐按以下步骤操作：

**步骤 1：确定模板用途**
```python
# 问自己以下问题：
# - 这个模板用于什么场景？
# - 需要哪些变量？
# - 消息级别是什么？（info/warning/error）
```

**步骤 2：定义模板**
```python
from FQBase.Core.notification_template import NotificationTemplate

# 在项目的初始化代码中定义
new_template = NotificationTemplate(
    name='price_alert',           # 唯一标识
    title='【价格告警】',          # 标题前缀
    body_template=(
        '标的: {code}\n'
        '当前价: {price}\n'
        '阈值: {threshold}\n'
        '时间: {time}'
    ),
    level='warning'               # warning 级别
)
```

**步骤 3：注册模板**
```python
# 在应用启动时注册（如 __init__.py 或启动脚本）
NotificationTemplate.register(new_template)
```

**步骤 4：使用模板**
```python
message = NotificationTemplate.render('price_alert',
    code='000001',
    price=12.50,
    threshold=12.00,
    time='2024-01-15 10:30:00'
)
sendWechat(message, channel='HIGH')
```

### 6.2 更新现有模板

**场景 1：修改模板内容（不改变变量）**
```python
# 直接修改 body_template
template = NotificationTemplate.get('trade_signal')
# 修改源码中的 body_template 定义
# 重启应用使更改生效
```

**场景 2：添加新变量**
```python
# 保持向后兼容
# 原模板: '标的: {code}\n价格: {price}'
# 新模板: '标的: {code}\n价格: {price}\n时间: {time}'

# 调用时可选参数使用默认值或空值
message = NotificationTemplate.render('trade_signal',
    code='000001',
    price=12.50,
    time=None  # 或不传
)
```

**场景 3：废弃模板**
```python
# 不删除，而是标记为废弃
# 在文档中说明废弃原因和替代方案

# 运行时检查并警告
def get_template_safe(name: str):
    template = NotificationTemplate.get(name)
    if template is None:
        return None
    if getattr(template, 'deprecated', False):
        logger.warning(f"模板 {name} 已废弃，请使用新模板")
    return template
```

### 6.3 团队协作规范

**命名规范**
```python
# 模板名称：领域_动作 格式（小写+下划线）
'trade_signal'      # 交易信号
'risk_alert'        # 风控告警
'order_update'      # 订单更新
'backtest_complete' # 回测完成

# 不推荐
'TradeSignal'      # 大驼峰
'tradeSignal'       # 小驼峰
'TRADE_SIGNAL'      # 全大写
```

**级别规范**
```python
# info: 普通信息通知（交易完成、回测完成）
# warning: 需要关注的警告（风控预警、数据异常）
# error: 错误和异常（系统错误、订单失败）

# 根据严重程度选择
'trade_signal'     -> info    # 正常业务通知
'risk_alert'       -> warning  # 需要关注
'system_error'     -> error    # 需要立即处理
```

**版本管理**
```python
# 在项目的配置文件中管理模板
# templates.py
TEMPLATES = {
    'trade_signal': {
        'title': '【交易信号】',
        'body': '策略: {strategy}\n股票: {code}\n价格: {price}',
        'level': 'info',
        'version': '1.0.0',
        'author': 'zhangsan',
        'created': '2024-01-01',
        'updated': '2024-01-15',
    },
}

# 批量注册
for name, config in TEMPLATES.items():
    template = NotificationTemplate(
        name=name,
        title=config['title'],
        body_template=config['body'],
        level=config['level'],
    )
    NotificationTemplate.register(template)
```

### 6.4 模板管理检查清单

新增或修改模板时，确保完成以下检查：

| 检查项 | 说明 |
|--------|------|
| 模板名称唯一 | 不要与现有模板重名 |
| 变量命名清晰 | 使用简洁、有意义的变量名 |
| 级别选择正确 | info/warning/error 与场景匹配 |
| 示例完整 | 提供完整的调用示例 |
| 文档更新 | 同步更新使用文档 |
| 测试验证 | 渲染结果符合预期 |
