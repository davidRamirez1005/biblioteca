<template>
  <el-drawer
    v-model="visible"
    :title="title"
    :direction="direction"
    :size="responsiveSize"
    :before-close="handleClose"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :modal="modal"
    :append-to-body="appendToBody"
    :destroy-on-close="destroyOnClose"
    class="custom-drawer"
  >
    <template v-if="$slots.header" #header>
      <slot name="header"></slot>
    </template>

    <template #default>
      <div class="drawer-content">
        <slot></slot>
      </div>
    </template>

    <template v-if="$slots.footer || showFooter" #footer>
      <slot name="footer">
        <div class="drawer-footer">
          <el-button @click="handleCancel">{{ cancelText }}</el-button>
          <el-button type="primary" @click="handleConfirm" :loading="confirmLoading">
            {{ confirmText }}
          </el-button>
        </div>
      </slot>
    </template>
  </el-drawer>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue"

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  direction: {
    type: String,
    default: "rtl",
    validator: (value) => ["ltr", "rtl", "ttb", "btt"].includes(value),
  },
  size: {
    type: [String, Number],
    default: "30%",
  },
  beforeClose: {
    type: Function,
    default: undefined,
  },
  closeOnClickModal: {
    type: Boolean,
    default: true,
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  modal: {
    type: Boolean,
    default: true,
  },
  appendToBody: {
    type: Boolean,
    default: false,
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  cancelText: {
    type: String,
    default: "Cancelar",
  },
  confirmText: {
    type: String,
    default: "Confirmar",
  },
  confirmLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["update:modelValue", "cancel", "confirm", "close"])

const windowWidth = ref(window.innerWidth)

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
})

const responsiveSize = computed(() => {
  const sizeValue =
    typeof props.size === "string" && props.size.includes("px") ? parseInt(props.size) : null

  if (windowWidth.value < 768) {
    return "95%"
  } else if (windowWidth.value < 1024) {
    if (sizeValue && sizeValue > 600) {
      return "85%"
    }
    return props.size
  }
  return props.size
})

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener("resize", handleResize)
})

onUnmounted(() => {
  window.removeEventListener("resize", handleResize)
})

const handleClose = (done) => {
  if (props.beforeClose) {
    props.beforeClose(done)
  } else {
    done()
    emit("close")
  }
}

const handleCancel = () => {
  visible.value = false
  emit("cancel")
}

const handleConfirm = () => {
  emit("confirm")
  visible.value = false
}
</script>

<style scoped>
.drawer-content {
  padding: 0 4px;
  overflow-x: hidden;
  word-wrap: break-word;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .drawer-footer {
    flex-direction: column-reverse;
    gap: 8px;
  }

  .drawer-footer .el-button {
    width: 100%;
  }
}

:deep(.el-drawer__body) {
  overflow-x: hidden;
  padding: 16px;
}

@media (max-width: 768px) {
  :deep(.el-drawer__body) {
    padding: 12px;
  }

  :deep(.el-drawer__header) {
    padding: 16px 12px;
  }

  :deep(.el-drawer__footer) {
    padding: 12px;
  }
}

:deep(img) {
  max-width: 100%;
  height: auto;
}

:deep(.el-image) {
  max-width: 100%;
}

:deep(.el-descriptions) {
  overflow-x: auto;
}

@media (max-width: 768px) {
  :deep(.el-descriptions__label) {
    font-size: 13px;
  }

  :deep(.el-descriptions__content) {
    font-size: 13px;
  }
}
</style>
