
## 背景 
高级组件传递属性的另一种方式。如下，
A --> B --> C --> D A组件包含B组件，B组件又包含C组件，C组件包含D组件。
现在状态维护在A组件中，希望通过props的方式传递到D组件，而D组件接收这个数据，并在内部修改这个数据后，再告之A组件。

```
<C v-bind="$attrs" v-on="$listeners"></C>
```
### 关键字 
vue attrs listeners

![image.png](https://upload-images.jianshu.io/upload_images/4071608-aaa25620d5d371a1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 逐层传递
### A组件
```
<template lang="pug">
<div style="border:1px solid #ccc;padding:10px">
  <h2>组件A 数据项:{{myData}}</h2>
  <B @changeMyData="changeMyData" :myData="myData"></B>
</div>
</template>
<script>
import B from "./B";
export default {
  data() {
    return {
      myData: "100"
    };
  },
  components: { B },
  methods: {
    changeMyData(val) {
      this.myData = val;
    }
  }
};
</script>

```
### B组件
```
<template>
  <div style="border:1px solid #ccc;padding:10px">
    <h3>组件B</h3>
    <C v-bind="$attrs" v-on="$listeners"></C>
  </div>
</template>
<script>
import C from "./C";
export default {
  components: { C },
};
</script>
```

### C组件
```
<template>
  <div style="border:1px solid #ccc;padding:10px">
    <h4>组件C</h4>
    <D v-bind="$attrs" v-on="$listeners"></D>
  </div>
</template>
<script>
import D from "./D";
export default {
  components: { D }
};
</script>
```
### D组件
```
<template>
  <div style="border:1px solid #ccc;padding:10px">
    <h5>组件D</h5>
    <input v-model="myd" @input="hInput" />
  </div>
</template>
<script>
import C from "./C";
export default {
  components: { C },
  props: { myData: { String } },
  created() {
    this.myd = this.myData;
    console.info(this.$attrs, this.$listeners);
  },
  methods: {
    hInput() {
      this.$emit("changeMyData", this.myd);
    }
  }
};
</script>
```

###  优点
A(发起者) --> B($attrs,$listeners) --> C($attrs,$listeners) -->D（使用者）
从顶层到使用层之间的层不再需要逐一列出来属性，只需要统一设置传递即可。

## 参考
[官网API](https://cn.vuejs.org/v2/api/#vm-attrs)
