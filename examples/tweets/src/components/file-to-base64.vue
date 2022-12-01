<template>
  <div
    class="drop-zone-default grid gap-4 rounded-2xl border-2 border-gray-700 bg-gradient-to-br p-8 transition duration-300"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
  >
    <input
      type="file"
      id="assetsFieldHandle"
      class="sr-only"
      ref="inputRef"
      @change="updateInputHandler"
      accept=".pdf,.jpg,.jpeg,.png"
    />

    <label for="assetsFieldHandle" class="block cursor-pointer">
      <div class="group grid gap-2 text-center">
        <p>Drag and drop to upload</p>
        <p class="text-xs text-gray-500">or</p>
        <p>
          <span
            class="text-blue-300 transition duration-200 group-hover:text-blue-400 group-hover:underline"
            >click here</span
          >
          to upload their files
        </p>
      </div>
    </label>
    <hr v-if="base64Small" class="border-t-2 border-gray-500" />
    <div v-if="base64Small" class="grid gap-2">
      <p>Preview</p>
      <img :src="base64Small" alt="" />
    </div>
    <div class="pointer-events-none invisible fixed">
      <p>Inputted</p>
      <canvas ref="canvasRef"></canvas>
      <img :src="base64Full" ref="fullImageRef" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string;
  resizedWidth: number;
}>();
const emit = defineEmits<{
  (event: "update:modelValue", newValue: string): void;
}>();
const inputRef = ref(null);
const fullImageRef = ref(null);
const canvasRef = ref(null);
const base64Full = ref("");
const base64Small = ref(props.modelValue ?? "");

const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function resizeImage(wantedWidth: number) {
  if (fullImageRef.value && canvasRef.value) {
    const aspect =
      (fullImageRef.value as any).width / (fullImageRef.value as any).height;
    (canvasRef.value as HTMLCanvasElement).width = wantedWidth;
    (canvasRef.value as HTMLCanvasElement).height = wantedWidth / aspect;

    (canvasRef.value as HTMLCanvasElement)
      .getContext("2d")
      ?.drawImage(
        fullImageRef.value as any,
        0,
        0,
        (canvasRef.value as HTMLCanvasElement).width,
        Math.min(
          (canvasRef.value as HTMLCanvasElement).height,
          props.resizedWidth * 2
        )
      );
    return (canvasRef.value as HTMLCanvasElement).toDataURL();
  }
  return "";
}

async function updateInputHandler() {
  if (inputRef.value) {
    const file = (inputRef.value as any).files[0];
    const res = await toBase64(file);
    base64Full.value = res + "";
    nextTick(() => {
      nextTick(() => {
        base64Small.value = resizeImage(props.resizedWidth);
        emit("update:modelValue", base64Small.value);
      });
    });
  }
}

function dragover(event: any) {
  event.preventDefault();
  if (!event.currentTarget.classList.contains("drop-zone-active")) {
    event.currentTarget.classList.remove("drop-zone-default");
    event.currentTarget.classList.add("drop-zone-active");
  }
}
function dragleave(event: any) {
  event.currentTarget.classList.add("drop-zone-default");
  event.currentTarget.classList.remove("drop-zone-active");
}
function drop(event: any) {
  event.preventDefault();
  (inputRef.value as any).files = event.dataTransfer.files;
  updateInputHandler(); // Trigger the onChange event manually
  event.currentTarget.classList.add("drop-zone-default");
  event.currentTarget.classList.remove("drop-zone-active");
}

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue && base64Small.value !== props.modelValue) {
      base64Small.value = props.modelValue;
    }
  }
);
</script>

<style lang="postcss">
.drop-zone-default {
  @apply bg-slate-900 from-slate-800;
}
.drop-zone-active {
  @apply bg-blue-900 from-slate-800;
}
</style>
