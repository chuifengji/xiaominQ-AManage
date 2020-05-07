import Vue from "vue";
import {
  Pagination,
  Dialog,
  Autocomplete,
  Input,
  InputNumber,
  Select,
  Option,
  Tooltip,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  Popover,
  Form,
  FormItem,
  Tag,
  Alert,
  Icon,
  Loading,
  MessageBox,
  Message,
  Notification,
} from "element-ui";
Vue.use(Pagination);
Vue.use(Tooltip);
Vue.use(Dialog);
Vue.use(Autocomplete);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Popover);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tag);
Vue.use(Alert);
Vue.use(Icon);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
