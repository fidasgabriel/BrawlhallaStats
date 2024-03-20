function getAllOptionsInputBrawlhalla() {
  fetch("https://brawlhalla.fly.dev/v1/legends/all")
    .then((data) => data.json())
    .then((order) =>
      order["data"].sort((a, b) => (a.bio_name > b.bio_name ? 1 : -1))
    )
    .then((json) =>
      json.map((e) => {
        let newOption = document.createElement("option");
        newOption.value = e.legend_name_key;
        newOption.text = e.bio_name;

        brawlhallaInput.appendChild(newOption);
      })
    );
}

let brawlhallaInput = document.querySelector("#brawlhallaLegends");
getAllOptionsInputBrawlhalla();

function getLegendBrawlhallaByName(value) {
  let myLegend;
  let currentLegendName;
  return fetch(`https://brawlhalla.fly.dev/v1/stats/id?brawlhalla_id=13100355`)
    .then((data) => {
      if (!data.ok) {
        console.error("Problemas ao pegar os personagens");
      }
      return data.json();
    })
    .then((json) => {
      cleanElements();
      myLegend = json["data"]["legends"].find(
        (el) => el.legend_name_key == value
      );
      return myLegend;
    })
    .then((legend) =>
      fetch(
        `https://brawlhalla.fly.dev/v1/legends/name?legend_name=${legend.legend_name_key}`
      )
    )
    .then((legendResponse) => legendResponse.json())
    .then((legendJson) => {
      let weapon1 = translatedWeaponsApi(legendJson["data"]["weapon_one"]);
      let weapon2 = translatedWeaponsApi(legendJson["data"]["weapon_two"]);
      currentLegendName = legendJson["data"]["bio_name"];
      Promise.all([weapon1, weapon2]).then((translatedWeapons) => {
        createElement(legendJson["data"], myLegend, translatedWeapons);
      });
    })
    .finally(() => getCrossovers(currentLegendName));
}

function translatedWeaponsApi(weapon) {
  return fetch(
    `https://brawlhallatranslateapi.onrender.com/translate/${weapon}`
  )
    .then((response) => {
      if (!response.ok) {
        console.error("Problemas ao traduzir as armas");
      }
      return response.json();
    })
    .then((e) => e["nome"])
    .catch((e) => {
      console.error("Rede da escola barrou!");
      return weapon;
    });
}

function onChangeValue(value) {
  getLegendBrawlhallaByName(value);
}

function onChangeEvent() {
  onChangeValue(brawlhallaInput.value);
}

function cleanElements() {
  let box = document.getElementById("caixa");
  let boxCross = document.getElementById("caixa-cross");

  box.innerHTML = "";
  boxCross.innerHTML = "";
}

function createElement(data, legendInfo, weapons) {
  let element = document.createElement("div");

  let mainContainer = document.createElement("div");
  let img = document.createElement("img");

  let mainInfo = document.createElement("div");
  let name = document.createElement("span");
  let lvl = document.createElement("span");
  let weaponsCont = document.createElement("div");

  let gamesInfo = document.createElement("div");

  let strengthContainer = document.createElement("div");
  let strengthSpan = document.createElement("span");
  let strImg = document.createElement("img");
  strImg.src =
    "https://static.wikia.nocookie.net/brawlhalla_gamepedia/images/f/f6/StatIcon_Str_NoBorder.png";
  strImg.setAttribute("class", "stance");

  let speedContainer = document.createElement("div");
  let speedSpan = document.createElement("span");
  let spdImg = document.createElement("img");
  spdImg.src =
    "https://static.wikia.nocookie.net/brawlhalla_gamepedia/images/d/db/StatIcon_Spd_NoBorder.png";
  spdImg.setAttribute("class", "stance");

  let defenseContainer = document.createElement("div");
  let defenseSpan = document.createElement("span");
  let defImg = document.createElement("img");
  defImg.src =
    "https://static.wikia.nocookie.net/brawlhalla_gamepedia/images/f/f9/StatIcon_Def_NoBorder.png";
  defImg.setAttribute("class", "stance");

  let dexContainer = document.createElement("div");
  let dexSpan = document.createElement("span");
  let dexImg = document.createElement("img");
  dexImg.src =
    "https://static.wikia.nocookie.net/brawlhalla_gamepedia/images/2/2e/StatIcon_Dex_NoBorder.png";
  dexImg.setAttribute("class", "stance");

  dexContainer.setAttribute(
    "style",
    "display: flex; justify-content: space-between; align-items: center"
  );
  speedContainer.setAttribute(
    "style",
    "display: flex; justify-content: space-between; align-items: center"
  );
  strengthContainer.setAttribute(
    "style",
    "display: flex; justify-content: space-between; align-items: center"
  );
  defenseContainer.setAttribute(
    "style",
    "display: flex; justify-content: space-between; align-items: center"
  );

  defenseSpan.setAttribute("class", "stanceInfo");
  strengthSpan.setAttribute("class", "stanceInfo");
  speedSpan.setAttribute("class", "stanceInfo");
  dexSpan.setAttribute("class", "stanceInfo");

  let gameInfoText = document.createElement("p");

  let winBar = document.createElement("div");
  let loseBar = document.createElement("div");
  let winPercent = document.createElement("div");

  element.setAttribute("class", "element");
  mainInfo.setAttribute("class", "mainInfo");
  mainContainer.setAttribute(
    "style",
    "gap: 1rem; display: flex; flex-direction: column;"
  );

  gamesInfo.setAttribute("class", "gamesInfo");

  name.textContent = data["bio_name"];

  weaponsCont.textContent = "(" + weapons[0] + ", " + weapons[1] + ")";

  lvl.textContent = "Lvl. " + legendInfo["level"];

  img.src =
    data["thumbnail"] == undefined ||
    data["bio_name"] == "Sidra" ||
    data["bio_name"] == "Caspian" ||
    data["bio_name"] == "Kaya"
      ? "https://images.start.gg/images/tournament/337047/image-a17334dff77a23fd6019dafce887a7bc.jpg?ehk=4pDkbo1X3y3yfBxA56p9J5xb76UgSn2sseavjeZm2kA%3D&ehkOptimized=Bdv8iaQq5Blsp%2FyR3vrv9S7NN%2FtYS7uIqNWjrsl7gEA%3D"
      : data["thumbnail"];
  gameInfoText.textContent =
    legendInfo["wins"] +
    "W/" +
    (legendInfo["games"] - legendInfo["wins"]) +
    "L (" +
    ((legendInfo["wins"] / legendInfo["games"]) * 100).toFixed(2) +
    "%" +
    ")";
  strengthSpan.textContent = "Força: " + data["strength"] + "/10";
  speedSpan.textContent = "Velocidade: " + data["speed"] + "/10";
  defenseSpan.textContent = "Defesa: " + data["defense"] + "/10";
  dexSpan.textContent = "Destreza: " + data["dexterity"] + "/10";

  let box = document.getElementById("caixa");

  winBar.setAttribute("class", "win");
  loseBar.setAttribute("class", "lose");
  winPercent.setAttribute("class", "winrate");
  weaponsCont.setAttribute("class", "weapons");

  winBar.setAttribute(
    "style",
    `width: ${((legendInfo["wins"] / legendInfo["games"]) * 100).toFixed(2)}%`
  );

  loseBar.setAttribute(
    "style",
    `width: ${
      100 - ((legendInfo["wins"] / legendInfo["games"]) * 100).toFixed(2)
    }%`
  );

  box.append(element);

  element.appendChild(mainContainer);

  mainContainer.appendChild(img);
  mainContainer.appendChild(mainInfo);
  mainInfo.appendChild(name);
  mainInfo.appendChild(lvl);
  mainContainer.appendChild(weaponsCont);

  element.appendChild(gamesInfo);

  gamesInfo.appendChild(strengthContainer);
  strengthContainer.appendChild(strengthSpan);
  strengthContainer.appendChild(strImg);

  gamesInfo.appendChild(dexContainer);
  dexContainer.appendChild(dexSpan);
  dexContainer.appendChild(dexImg);

  gamesInfo.appendChild(defenseContainer);
  defenseContainer.appendChild(defenseSpan);
  defenseContainer.appendChild(defImg);

  gamesInfo.appendChild(speedContainer);
  speedContainer.appendChild(speedSpan);
  speedContainer.appendChild(spdImg);

  gamesInfo.appendChild(gameInfoText);

  gamesInfo.appendChild(winPercent);

  winPercent.appendChild(winBar);
  winPercent.appendChild(loseBar);
}

function createCrossover(data, legend) {
  let legendSelect = legend;

  let crossovers = data.filter((e) => e.legendName == legendSelect);

  let box = document.getElementById("caixa-cross");

  let textTitle = document.createElement("span");

  textTitle.setAttribute("class", "title");

  let caixita = document.createElement("div");

  caixita.setAttribute("style", "display: flex; gap: 6rem");

  caixita.setAttribute("id", "caixita");

  textTitle.textContent = `Crossovers de ${legendSelect}:`;

  box.appendChild(textTitle);
  box.append(caixita);

  crossovers.map((e) => buildCrossover(e));
}

function buildCrossover(data) {
  let element = document.createElement("div");

  let mainContainer = document.createElement("div");
  let img = document.createElement("img");

  let mainInfo = document.createElement("div");
  let name = document.createElement("span");

  let box = document.getElementById("caixita");

  let cont = document.getElementById("caixa-cross");

  mainContainer.setAttribute("class", "crossover");
  mainInfo.setAttribute("class", "mainInfo");

  cont.setAttribute("style", "margin-top: 6rem");

  img.setAttribute("class", "imgCross");

  box.appendChild(element);
  element.appendChild(mainContainer);
  mainContainer.appendChild(img);
  mainContainer.appendChild(mainInfo);
  mainInfo.appendChild(name);

  name.textContent = data["name"];
  img.setAttribute("src", data["urlPic"]);
  mainInfo.firstChild.setAttribute("style", "margin: auto; padding");
}

function getCrossovers(currentLegend) {
  return fetch("https://brawlhallatranslateapi.onrender.com/crossovers")
    .then((response) => {
      if (!response.ok) {
        console.error("Problems fetching crossovers");
      }
      return response.json();
    })
    .then((data) => createCrossover(data, currentLegend))
    .catch((error) => console.error("Erro:", error));
}
