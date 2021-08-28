// <script src="https://unpkg.com/js-wasm/js-wasm.js"></script>
function twoSketch() {
}

import("https://"+location.host+"/node_modules/js-wasm/js-wasm.js").then((rs1,rj1) => {
  if (rs1) {
    console.log("Response:\n",rs1);
    jw = JsWasm.createEnvironment();
    import("https://"+location.host+"/libraries/two.js/build/two.js").then((rs2,rj2) => {
      if (rs2) {
        console.log("Response:\n",rs2);
        twoSketch();
      }
      if (rj2) {
        console.log("Reject:\n",rj2);
      }
    }).catch((err2)=>{console.error("two.js\n",err2);});
}
if (rj1) {
  console.log("Reject:\n",rj1);
}
}).catch((err1)=>{console.error("js-wasm\n",err1);});
