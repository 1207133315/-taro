<template>
  <div>
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      :defaultConfig="editorConfig"
      :mode="mode"
      v-model="valueHtml"
      style="height: 400px; overflow-y: hidden"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>

</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import {onBeforeUnmount, ref, shallowRef, onMounted, inject} from 'vue';
import {Editor, Toolbar} from '@wangeditor/editor-for-vue';

const baseUrl = inject("server_baseUrl")
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
const toolbarConfig = {
  excludeKeys: ["uploadVideo"]
};
const editorConfig = {
  placeholder: '请输入内容...',
};
editorConfig.MENU_CONF = {}
// 图片上传
editorConfig.MENU_CONF['uploadImage'] = {
  // 先指定服务端地址
  server: baseUrl + '/upload/upload',
  base64LimitSize: 10 * 1024 // 10kb
}
editorConfig.MENU_CONF['insertImage'] = {
  parseImageSrc: (src) => {
    if (src.indexOf("http") !== 0) {
      return `${baseUrl}${src}`
    } else {
      return src
    }
  }
}
const mode = ref("default")
// 内容 HTML
const valueHtml = ref("");


const emit = defineEmits(["updateValue"])

const message = inject("message");
const setValueHtml = (content) => {
  valueHtml.value = content
}

// 向父组件暴漏方法  想要给父组件暴漏哪个方法都可以
defineExpose({setValueHtml})


// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;

  editor.destroy();
});
// 编辑器回调函数
const handleCreated = (editor) => {
  console.log('created', editor);
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
  console.log('change:', editor.getHtml());
  emit("updateValue", valueHtml.value)
};

</script>

<style scoped>

</style>
