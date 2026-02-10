// import './style.css'
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
import { Image, decode, writeCanvas } from 'image-js';

interface ReadImage {
  fileName: string,
  file: File,
  content: string | ArrayBuffer | null
}

const readImageAsArrayBuffer = (file: File): Promise<ReadImage> => new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
        resolve({fileName: file.name.substring(0, file.name.lastIndexOf(".")), file: file, content: event.target!.result})
    }
    reader.readAsArrayBuffer(file)
});


(async (appContainer: HTMLDivElement) => {
  if (!appContainer) {
    return;
  }

  const inputFileElement = document.createElement("input");
  inputFileElement.type = "file";
  inputFileElement.multiple = true;
  inputFileElement.classname = "form-control";
  inputFileElement.addEventListener("change", async (event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const readImages = await Promise.all(Array.from(files).map(readImageAsArrayBuffer));
    readImages
    .map((readImage) => {
      const image: Image = decode(new DataView(readImage.content as ArrayBuffer));
      return image
        .grey()
        .threshold(); // default option is empty
    })
    .forEach((image, _) => {
      const canvas = document.createElement("canvas");
      writeCanvas(image, canvas);
      appContainer.appendChild(canvas);
    });
  });

  appContainer.appendChild(inputFileElement);
})(document.querySelector<HTMLDivElement>('#app')!);


