<template>
  <div>
    <div ref="editor" style="text-align:left;height:500px;" class="text"></div>
  </div>
</template>

<script>
import E from "wangeditor";
export default {
  name: "editor",
  data() {
    return {
      editorContent: "",
    };
  },
  props: {
    originalData: String,
  },
  methods: {},
  mounted() {
    var editor = new E(this.$refs.editor);
    editor.customConfig.onchange = (html) => {
      this.editorContent = html;
    };
    editor.create();
    editor.txt.html(this.originalData);
  },
};
</script>

<style scoped>
</style>