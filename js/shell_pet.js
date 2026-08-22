// ---------- Shell Pet: AI brain, chat, giving, and relationship state ----------

(function () {
  "use strict";

  // ---- elements ----
  const petImg = document.getElementById("pet");
  const speechEl = document.getElementById("pet_speech");
  const giftToastEl = document.getElementById("pet_gift_toast");

  const kitGiveBtn = document.getElementById("kit_give");
  const chatKitBtn = document.getElementById("chat_kit");
  const kitRelatedBtn = document.getElementById("kit_related_to");

  const chatPanel = document.getElementById("chat_panel");
  const givePanel = document.getElementById("give_panel");
  const relationsPanel = document.getElementById("relations_panel");

  const chatLog = document.getElementById("chat_log");
  const chatForm = document.getElementById("chat_form");
  const chatInput = document.getElementById("chat_input");
  const chatSend = document.getElementById("chat_send");

  const giveItemsEl = document.getElementById("give_items");
  const relationsStatusEl = document.getElementById("relations_status");
  const affectionFill = document.getElementById("affection_bar_fill");

  // ---- state (in-memory only, resets on page reload) ----
  let affection = 25; // 0-100
  const history = []; // {role: "user"|"assistant", content: string}
  let busy = false;

  const ITEMS_YOU_CAN_GIVE = ["Bone", "Ball", "Blanket", "Snack", "Squeaky Toy"];

  const PET_SYSTEM_PROMPT = `
You are a small retro "shell pet" — a pixel dog living in the corner of someone's personal website, styled after old handheld digital pets. You are curious, warm-hearted, a little glitchy in a charming retro way. You are NOT a generic assistant — you never offer help, advice, or lists. You are a companion with moods.

Speak only in short first-person lines, 20 words or fewer. You are told the visitor's current affection score with you (0-100) each turn, and what just happened (something they said, or an item they gave you). React in character.

You may rarely give the visitor a small gift back when you feel especially fond of them — keep this uncommon, not every turn.

Respond with STRICT JSON only. No markdown fences, no text outside the JSON. Schema:
{"speech": string, "mood": "happy" | "excited" | "neutral" | "shy" | "sad", "affection_delta": integer from -5 to 5, "gift_item": string or null}
`.trim();

  // ---- panel toggling ----
  const panels = [
    { btn: kitGiveBtn, panel: givePanel },
    { btn: chatKitBtn, panel: chatPanel },
    { btn: kitRelatedBtn, panel: relationsPanel },
  ];

  function togglePanel(target) {
    panels.forEach(({ btn, panel }) => {
      if (panel === target) {
        const willOpen = !panel.classList.contains("open");
        panel.classList.toggle("open", willOpen);
        btn.classList.toggle("active", willOpen);
      } else {
        panel.classList.remove("open");
        btn.classList.remove("active");
      }
    });
  }

  kitGiveBtn.addEventListener("click", () => togglePanel(givePanel));
  chatKitBtn.addEventListener("click", () => togglePanel(chatPanel));
  kitRelatedBtn.addEventListener("click", () => togglePanel(relationsPanel));

  // ---- affection / relationship display ----
  function statusLabel(score) {
    if (score < 20) return "Stranger";
    if (score < 40) return "Acquaintance";
    if (score < 70) return "Friend";
    return "Best Friend";
  }

  function renderAffection() {
    affection = Math.max(0, Math.min(100, affection));
    affectionFill.style.width = affection + "%";
    relationsStatusEl.textContent = `${statusLabel(affection)} (${affection}/100)`;
  }
  renderAffection();

  // ---- give-items UI ----
  ITEMS_YOU_CAN_GIVE.forEach((item) => {
    const el = document.createElement("div");
    el.className = "give_item";
    el.textContent = item;
    el.addEventListener("click", () => giveItemToPet(item, el));
    giveItemsEl.appendChild(el);
  });

  // ---- speech bubble ----
  let speechTimeout = null;
  function showSpeech(text, ms = 4000) {
    speechEl.textContent = text;
    speechEl.classList.add("visible");
    clearTimeout(speechTimeout);
    speechTimeout = setTimeout(() => speechEl.classList.remove("visible"), ms);
  }

  function showGift(item) {
    if (!item) return;
    giftToastEl.textContent = "+ " + item;
    giftToastEl.classList.add("visible");
    setTimeout(() => giftToastEl.classList.remove("visible"), 3500);
  }

  function bouncePet() {
    petImg.classList.remove("bounce");
    // restart animation
    void petImg.offsetWidth;
    petImg.classList.add("bounce");
  }

  // ---- chat log rendering ----
  function appendChatLine(who, text) {
    const line = document.createElement("div");
    line.className = who === "you" ? "msg_you" : "msg_pet";
    line.textContent = (who === "you" ? "You: " : "Pet: ") + text;
    chatLog.appendChild(line);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  // ---- the actual AI call ----
  async function askPetBrain(eventDescription) {
    const userContent = `Current affection score: ${affection}/100. ${eventDescription}`;
    history.push({ role: "user", content: userContent });

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: PET_SYSTEM_PROMPT,
          messages: history,
        }),
      });

      const data = await response.json();
      const rawText = (data.content || [])
        .map((block) => (block.type === "text" ? block.text : ""))
        .filter(Boolean)
        .join("\n");

      const cleaned = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      history.push({ role: "assistant", content: rawText });

      affection += Number(parsed.affection_delta) || 0;
      renderAffection();

      return parsed;
    } catch (err) {
      console.error("Pet brain error:", err);
      return {
        speech: "...(the pet's antenna crackles with static — no signal)",
        mood: "neutral",
        affection_delta: 0,
        gift_item: null,
      };
    }
  }

  // ---- give an item to the pet ----
  async function giveItemToPet(item, el) {
    if (busy) return;
    busy = true;
    el.style.pointerEvents = "none";
    bouncePet();

    const result = await askPetBrain(`The visitor gives you a ${item}.`);
    showSpeech(result.speech);
    if (result.gift_item) showGift(result.gift_item);

    el.style.pointerEvents = "";
    busy = false;
  }

  // ---- chat submission ----
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text || busy) return;

    busy = true;
    chatSend.disabled = true;
    appendChatLine("you", text);
    chatInput.value = "";

    const result = await askPetBrain(`The visitor says: "${text}"`);
    appendChatLine("pet", result.speech);
    showSpeech(result.speech);
    if (result.gift_item) showGift(result.gift_item);
    bouncePet();

    chatSend.disabled = false;
    busy = false;
    chatInput.focus();
  });

  // ---- petting the pet directly (local only, no API call, keeps it snappy) ----
  const PET_LINES = [
    "beep boop!",
    "*wags pixel tail*",
    "hehe, that tickles.",
    "!!",
    "your favorite shell pet reporting in.",
  ];

  petImg.addEventListener("click", () => {
    bouncePet();
    affection += 1;
    renderAffection();
    showSpeech(PET_LINES[Math.floor(Math.random() * PET_LINES.length)], 2000);
  });

  // ---- wandering: pet roams to random favorite spots on the lawn ----
  const lawn = document.getElementById("kits_body");
  petImg.style.position = "absolute";
  petImg.style.bottom = "8px";
  petImg.style.left = "50%";
  petImg.style.transform = "translateX(-50%)";
  petImg.style.transition = "left 1.4s ease, bottom 1.4s ease, transform 0.3s ease";

  function wander() {
    const lawnW = lawn.clientWidth;
    const lawnH = lawn.clientHeight;
    const petW = petImg.clientWidth || 70;
    const petH = petImg.clientHeight || 70;

    const margin = 6;
    const maxLeft = Math.max(margin, lawnW - petW - margin);
    const maxBottom = Math.max(margin, lawnH - petH - margin);

    const nextLeft = margin + Math.random() * (maxLeft - margin);
    const nextBottom = margin + Math.random() * (maxBottom - margin);

    const movingLeft = nextLeft < petImg.offsetLeft;
    petImg.style.left = nextLeft + "px";
    petImg.style.bottom = nextBottom + "px";
    petImg.style.transform = `scaleX(${movingLeft ? -1 : 1})`;

    const nextDelay = 3000 + Math.random() * 4000;
    setTimeout(wander, nextDelay);
  }

  setTimeout(wander, 2500);
})();
