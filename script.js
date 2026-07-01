const ids = [
  "projectName",
  "spaceType",
  "area",
  "drawingScale",
  "siteCondition",
  "siteIssues",
  "behaviorGoal",
  "conceptTitle",
  "conceptText",
  "moodKeywords",
  "styleDirection",
  "materialLight",
  "drawingConstraints",
  "sourceMaterials",
];

const fields = Object.fromEntries(ids.map((id) => [id, document.querySelector(`#${id}`)]));

const outputs = {
  promptDirectBoard: document.querySelector("#promptDirectBoard"),
  promptReasoning: document.querySelector("#promptReasoning"),
  promptAccuracy: document.querySelector("#promptAccuracy"),
  promptTactics: document.querySelector("#promptTactics"),
  promptBoard: document.querySelector("#promptBoard"),
};

const statusEl = document.querySelector("#status");
const sourceFilesInput = document.querySelector("#sourceFilesInput");
const assetList = document.querySelector("#assetList");
const assetNotes = document.querySelector("#assetNotes");
let assets = [];

const stylePresets = {
  "現代奶油風": "色彩：米白、奶茶色、暖灰、淺木色。材質：礦物塗料、淺色木皮、霧面金屬、柔軟織品。光線：低色溫、間接照明、壁洗光、柔和分層光源。",
  "日式無印風": "色彩：白、淺灰、原木色、亞麻色。材質：白橡木、棉麻、和紙感燈罩、霧面塗料。光線：自然採光、柔光、低對比照明。",
  "侘寂自然風": "色彩：泥灰、砂岩、米褐、深木色。材質：手感塗料、粗質木材、石材、陶土、自然肌理。光線：低照度、局部重點光、陰影層次。",
  "北歐溫潤風": "色彩：白、霧灰、淺木、低彩度藍綠。材質：淺木、羊毛、棉麻、霧面塗裝。光線：明亮自然光、均質環境光、暖色輔助照明。",
  "義式低奢風": "色彩：暖灰、象牙白、深咖、黑鈦、香檳金。材質：石材、大板磚、皮革、金屬、深色木皮。光線：精準重點光、線性燈、低反射光感。",
  "現代極簡風": "色彩：白、灰、黑、單一重點色。材質：烤漆、玻璃、金屬、細緻塗料。光線：線性光、隱藏光源、乾淨俐落的明暗邊界。",
  "工業混凝土風": "色彩：水泥灰、黑鐵、深木、磚紅。材質：清水混凝土、黑鐵件、粗木、裸露管線、金屬網。光線：軌道燈、局部重點光、較高對比。",
  "中古復古風": "色彩：胡桃木、芥末黃、橄欖綠、焦糖、米白。材質：胡桃木、藤編、皮革、復古磚、金屬。光線：暖黃燈、桌燈、壁燈、復古氛圍光。",
  "高端飯店風": "色彩：象牙白、暖灰、深木、金屬點綴。材質：石材、木皮、皮革、金屬、織品。光線：情境照明、壁洗光、層次化間接照明。",
  "校園公共空間風": "色彩：暖白、淺木、低彩度品牌色、柔和灰。材質：耐磨地坪、木質界面、吸音板、可維護塗料、展示板。光線：明亮但不刺眼，入口重點光、公告展示光、等候區暖光。",
  "品牌商業風": "色彩：依品牌色延伸，搭配中性色背景。材質：品牌識別牆、展示層板、金屬、燈箱、耐磨地材。光線：入口焦點光、商品展示光、導引性照明。",
  "藝廊白盒風": "色彩：白、冷灰、低飽和中性色。材質：白牆、無縫地坪、細框金屬、展牆系統。光線：均質展覽照明、可調軌道燈、洗牆光。",
  "自然療癒風": "色彩：米白、鼠尾草綠、淺木、暖灰。材質：木質、織品、植栽、礦物塗料、自然石材。光線：柔和自然光、低眩光、溫暖間接照明。",
  "未來科技風": "色彩：冷白、銀灰、黑、藍紫光點綴。材質：金屬、玻璃、半透明板、發光膜、穿孔板。光線：線性燈、動態光、冷暖對比。",
  "競圖敘事風": "色彩：低彩度背景、單一強調色、清楚圖面層級。材質：依概念抽象化呈現，重視圖說與分析可讀性。光線：主視覺服務概念，圖面區保持乾淨高辨識。"
};

function value(id) {
  return fields[id].value.trim();
}

function syncMaterialLight() {
  fields.materialLight.value = stylePresets[value("styleDirection")] || stylePresets["現代奶油風"];
}

function projectBlock() {
  return `Project data:
- Project: ${value("projectName")}
- Space type: ${value("spaceType")}
- Area / scale: ${value("area")}
- Drawing scale: ${value("drawingScale")}
- Site condition: ${value("siteCondition")}
- Site issues: ${value("siteIssues")}
- User behavior goals: ${value("behaviorGoal")}
- Core concept: ${value("conceptTitle")}
- Concept description: ${value("conceptText")}
- Mood keywords: ${value("moodKeywords")}
- Style direction: ${value("styleDirection")}
- Material / color / lighting: ${value("materialLight")}
- Source materials: ${value("sourceMaterials")}
- Uploaded asset guide:
${assetNotes.value || "No files organized in the app yet. If images are uploaded directly to the AI tool, treat them as source materials and do not invent missing dimensions."}`;
}

function accuracyCore() {
  return `Drawing accuracy rules:
- Keep existing walls, columns, beams, openings, windows, doors, stairs, wet areas, shafts and main structure unchanged.
- Do not invent exact dimensions. Mark unknown dimensions as "to be confirmed".
- Plan, section, axonometric and perspective must describe the same design.
- If original drawings are missing, use schematic placeholders, not construction drawings.
- Label drawings as: verified from source / interpreted from photo / conceptual proposal.`;
}

function generateDirectBoardPrompt() {
  return `請根據以下 Prompt 生成一張 A1 橫式室內設計提案版面。

請直接生成版面圖片，不要回覆分析文字，不要只整理提示詞，不要只生成單張室內渲染圖。

Prompt:

Create one complete A1 landscape interior design proposal board image.

${projectBlock()}

Use the uploaded site photos and drawings as source materials. The output must be a finished A1 presentation board, not a text explanation, not a prompt, not a moodboard, and not a single interior render.

Board narrative:
site photo analysis → design thesis → core concept → design strategies → drawing evidence → final atmosphere.

Required layout:
1. Large main render, 35–45% of board.
2. Site photo analysis overlay with arrows, color blocks and numbered notes: circulation, pause area, visual focus, existing noise, transformable corner/interface.
3. Problem → strategy → drawing evidence matrix.
4. Five concept diagrams: diagnose, layer, connect, insert, form.
5. Six design strategy cards with small diagrams and captions.
6. Schematic plan, circulation diagram, schematic section, axonometric strategy diagram, material and lighting palette, before/after strip.
7. Small drawing accuracy notes.

${accuracyCore()}

Visual style:
professional architecture competition board, refined grid, generous white space, readable typography, warm modern interior proposal, elegant line diagrams, precise schematic drawings, high-end academic design board, calm but rigorous.

Avoid:
moodboard, real estate poster, pure collage, unreadable tiny text, fake construction drawings, inconsistent plan/section/perspective.

Final output: a complete A1 landscape interior design proposal board image.`;
}

function generateReasoningPrompt() {
  return `請根據現場照片、圖面與以下資料，整理成室內設計提案的推理內容。不要做版面，只做設計推理。

${projectBlock()}

請輸出：
1. 現場判讀：已確認 / 待確認。
2. 設計命題：一句話說明這個案子的核心設計問題。
3. 核心概念：說明概念如何影響動線、界面、材質、光線與行為。
4. 問題 → 設計手法 → 對應圖面 → 預期效果。
5. 3–5 個空間策略。
6. 可放入版面的短圖說文字。

請用繁體中文，語氣像室內設計競圖提案。`;
}

function generateAccuracyPrompt() {
  return `請根據以下專案資料，整理圖面正確性要求，供後續 AI 生成版面時遵守。

${projectBlock()}

${value("drawingConstraints")}

請輸出：
- 不可更動的現場 / 圖面條件
- 可自由設計的範圍
- 缺失資料
- 圖面風險
- 平面、剖面、軸測、透視必須一致的項目
- 需標註「待確認」的項目

原則：美感可以生成，但圖面邏輯不可亂編。`;
}

function generateTacticsPrompt() {
  return `請根據以下資料產生可放入 A1 版面的設計手法與圖說。

${projectBlock()}

請輸出：
1. 一個主操作：說明它如何統整整體設計。
2. 五個概念圖說：判讀、分層、串連、植入、成形。
3. 六個設計手法：每個包含「對應問題、操作方式、對應圖面、短圖說」。
4. 一個「問題 → 手法 → 圖面證明」表格。

所有圖說都要能解釋設計，不要只是描述畫面。`;
}

function generateBoardPrompt() {
  return `這一段是「文字模型專用」，用途是當你已經得到一張不夠好的 A1 版面後，請文字 AI 幫你整理下一次要貼回影像 AI 的修正版英文 prompt。這段不會直接產圖。

請根據以下資料，修正已生成的 A1 室內設計提案版面，使它更像成熟競圖版面。

${projectBlock()}

修正目標：
- 強化現場照片 overlay，不要只拼貼照片。
- 加入「問題 → 手法 → 圖面證明」矩陣。
- 讓主視覺、平面、剖面、軸測呈現同一套設計。
- 縮短文字，增加圖面與圖說的可讀性。
- 強化主操作與輔助手法的主從關係。
- 保留留白、清楚網格、可閱讀字級。
- 標示圖面可信度與待確認項目。

${accuracyCore()}

請只輸出一段可貼回影像 AI 的修正版英文 prompt，不要評分、不要分析。`;
}

function inferAssetRole(fileName) {
  const name = fileName.toLowerCase();
  if (name.includes("plan") || name.includes("平面")) return "平面圖 / 尺度依據";
  if (name.includes("section") || name.includes("剖")) return "剖面圖 / 高度依據";
  if (name.includes("入口") || name.includes("entry")) return "入口 / 動線判讀";
  if (name.includes("問題") || name.includes("corner") || name.includes("角")) return "問題角落 / 可轉化界面";
  if (name.includes("ref") || name.includes("參考") || name.includes("版面")) return "參考版面 / 視覺方向";
  return "現場照片 / 空間判讀";
}

function renderAssets() {
  assetList.innerHTML = "";

  if (!assets.length) {
    assetNotes.value = "尚未在 APP 內整理素材。若要提高品質，請上傳並標註：現場全景、入口 / 動線、問題角落、平面圖、剖面圖或參考版面。";
    return;
  }

  assets.forEach((asset, index) => {
    const item = document.createElement("div");
    item.className = "asset-item";

    const thumb = document.createElement("div");
    thumb.className = "asset-thumb";
    if (asset.previewUrl) {
      const image = document.createElement("img");
      image.src = asset.previewUrl;
      image.alt = asset.name;
      thumb.appendChild(image);
    } else {
      thumb.textContent = "PDF";
    }

    const meta = document.createElement("div");
    meta.className = "asset-meta";

    const name = document.createElement("div");
    name.className = "asset-name";
    name.textContent = `${String(index + 1).padStart(2, "0")}｜${asset.name}`;

    const select = document.createElement("select");
    [
      "現場全景 / 空間氛圍",
      "入口 / 動線判讀",
      "問題角落 / 可轉化界面",
      "牆面 / 展示 / 資訊介面",
      "採光 / 窗景 / 光線條件",
      "平面圖 / 尺度依據",
      "剖面圖 / 高度依據",
      "材質 / 細部 / 現況質感",
      "參考版面 / 視覺方向",
      "其他補充資料",
    ].forEach((role) => {
      const option = document.createElement("option");
      option.value = role;
      option.textContent = role;
      if (asset.role === role) option.selected = true;
      select.appendChild(option);
    });
    select.addEventListener("change", () => {
      asset.role = select.value;
      updateAssetNotes();
      generatePrompts();
    });

    meta.appendChild(name);
    meta.appendChild(select);
    item.appendChild(thumb);
    item.appendChild(meta);
    assetList.appendChild(item);
  });

  updateAssetNotes();
}

function updateAssetNotes() {
  if (!assets.length) return;
  assetNotes.value = assets
    .map((asset, index) => `${String(index + 1).padStart(2, "0")}. ${asset.name}｜用途：${asset.role}`)
    .join("\n");
}

function generatePrompts() {
  syncMaterialLight();
  outputs.promptDirectBoard.value = generateDirectBoardPrompt();
  outputs.promptReasoning.value = generateReasoningPrompt();
  outputs.promptAccuracy.value = generateAccuracyPrompt();
  outputs.promptTactics.value = generateTacticsPrompt();
  outputs.promptBoard.value = generateBoardPrompt();
  statusEl.textContent = "已生成提示詞。要產生圖片請使用 00；04 是給文字 AI 幫你修下一版 prompt，不會直接產圖。";
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
  statusEl.textContent = "已複製到剪貼簿。";
}

document.querySelector("#generateBtn").addEventListener("click", generatePrompts);

document.querySelector("#copyAllBtn").addEventListener("click", () => {
  const all = Object.values(outputs)
    .map((textarea) => textarea.value)
    .join("\n\n---\n\n");
  copyText(all);
});

document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", () => {
    copyText(outputs[button.dataset.copy].value);
  });
});

fields.styleDirection.addEventListener("change", () => {
  syncMaterialLight();
  generatePrompts();
});

sourceFilesInput.addEventListener("change", () => {
  assets.forEach((asset) => {
    if (asset.previewUrl) URL.revokeObjectURL(asset.previewUrl);
  });
  assets = Array.from(sourceFilesInput.files).map((file) => ({
    name: file.name,
    role: inferAssetRole(file.name),
    previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
  }));
  renderAssets();
  generatePrompts();
});

Object.values(fields).forEach((field) => {
  if (field.id === "materialLight" || field.id === "styleDirection") return;
  field.addEventListener("input", generatePrompts);
  field.addEventListener("change", generatePrompts);
});

syncMaterialLight();
renderAssets();
generatePrompts();
