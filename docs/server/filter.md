## 过滤器

### KDJ

- (data['JLong'] > data['JLMA']) 
-  (((data['J09'] > data['JShort']) & (data['JShort'] > data['JLong'])) | ((data['J34'] > data['K34']) | (data['J89'] > data['K89']) | (data['J200'] > data['K200'])))  

### 成交金额

-  ((data['open'] + data['close'] + data['low'] + data['high']) * 36 * 20000 < data['amount'])
- (data['amount'] > 50000000)

### sp_strong

- (data['close'] > data['MA5'])  & (data['close'] > data['MA60'])