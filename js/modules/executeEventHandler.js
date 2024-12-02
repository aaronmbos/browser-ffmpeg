import { executeCommand } from "./transcoder.js";
import { parseFfmpegCommand } from "./commandParser.js";
import { isVideoFile } from "./utils.js";

async function handleExecuteEvent() {
  const elements = getElements();
  resetOutput(elements);

  const commandArgs = parseFfmpegCommand(elements.command.value);

  elements.status.classList.remove("hidden");

  let data = {};
  try {
    elements.output.classList.remove("hidden");

    data = await executeCommand(elements.uploader.files[0], commandArgs);

    if (isVideoFile(commandArgs[commandArgs.length - 1])) {
      elements.video.classList.remove("hidden");
      elements.video.src = URL.createObjectURL(new Blob([data.buffer]));
      elements.video.load();
    } else {
      elements.img.classList.remove("hidden");
      elements.img.src = URL.createObjectURL(
        new Blob([data.buffer], { type: "image/jpeg" })
      );
    }
    elements.status.innerText = "Command completed successfully.";
    elements.status.classList.remove("italic");
    elements.status.classList.add("font-bold");
  } catch (error) {
    handleError(error, elements);
  }
}

const getElements = () => {
  const status = document.getElementById("status-msg");
  const output = document.getElementById("output-container");
  const command = document.getElementById("command");
  const uploader = document.getElementById("uploader");
  const img = document.getElementById("output-image");
  const video = document.getElementById("output-video");

  return {
    status,
    output,
    command,
    uploader,
    img,
    video,
  };
};

const resetOutput = ({ output, img, video, status }) => {
  output.classList.add("hidden");
  img.src = "";
  img.classList.add("hidden");
  video.classList.add("hidden");
  video.src = "";
  status.innerText = "Running your command ...";
  status.classList.add("italic");
  status.classList.remove("font-bold");
  status.classList.toggle("hidden");
  if (status.classList.contains("text-red-600")) {
    status.classList.remove("text-red-600");
  }
};

const handleError = (error, { status }) => {
  status.innerText = "An error occurred while executing the command.";
  status.classList.remove("italic");
  status.classList.add("font-bold");
  status.classList.add("text-red-600");
  console.error(error);
};

export { handleExecuteEvent };
