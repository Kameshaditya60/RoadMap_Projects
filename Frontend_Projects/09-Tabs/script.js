const buttons = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    // sabhi buttons se active hatado
    buttons.forEach(b => b.classList.remove("active"));
    // clicked button ko active do
    btn.classList.add("active");

    // sabhi content hide karo
    contents.forEach(c => c.classList.remove("active"));

    // jis button pe click hua uska data-tab nikalo
    const tabId = btn.getAttribute("data-tab");

    // wahi content show karo
    document.getElementById(tabId).classList.add("active");
  });
});
