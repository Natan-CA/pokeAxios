const axios = require("axios");

//Pokedex de Console usando o Axios para as requisições

//TO DO - precisa arrumar as evoluções de pokemons exemplo poliwag

// Basta mudar o nome do pokemon e escrever o comando "node api.js" no terminal
showPokemon("espurr");

async function searchPokemon(poke_name) {
  try {
    var response = await axios.get(
      `http://pokeapi.co/api/v2/pokemon/${poke_name}/`
    );

    var pokeData = response.data;

    //tratar os diferentes tipos de erro
  } catch (error) {
    console.error(error.response.status + " " + error.response.statusText);
    console.log(`Pokemon ${poke_name} não encontrado`);
    process.exit();
  }

  return pokeData;
}

async function searchAddInfo(poke_url) {
  try {
    var response = await axios.get(poke_url);

    var pokeAddData = response.data;

    //precisa tratar individualmente os erros
  } catch (error) {
    console.error(error.response.status + " " + error.response.statusText);
    console.log("Url não encontrada: " + poke_url);
  }

  return pokeAddData;
}

function pokeType(types) {
  //variavel par armazenar os tipos
  var typeInfo;

  if (types[1] === undefined) {
    typeInfo = types[0].type.name;
  } else {
    typeInfo = types[1].type.name + " | " + types[0].type.name;
  }
  return console.log("TYPE: " + typeInfo);
}

//Função para determinar os generos no qual pokemon pode ser encontrado
function pokeGender(gender_rate) {
  //variavevel para armazenar os genero
  var genderInfo;
  if (gender_rate == 0) {
    genderInfo = "male";
  } else if (gender_rate == 8) {
    genderInfo = "female";
  } else if (gender_rate >= 1 && gender_rate <= 7) {
    genderInfo = "male | female";
  } else {
    genderInfo = "genderless";
  }
  console.log("GENDER: " + genderInfo);
}

function pokeEvolution(evolution) {
  var evo = searchAddInfo(evolution);

  evo.then((result, error) => {
    if (result) {
      let evoInfo = result.chain;
      //checa se possui evoluções

      for (var i = 0; i < evoInfo.evolves_to.length; i++) {
        if (evoInfo.evolves_to[i] === undefined) {
          console.log("EVOLUTION: Pokemon does not have an evolution");
          //checa se possui apenas 1 evolução
        } else if (evoInfo.evolves_to[i].evolves_to[i] === undefined) {
          console.log(
            "EVOLUTIONS: " +
              evoInfo.species.name +
              " > " +
              evoInfo.evolves_to[i].species.name
          );
        } else {
          console.log(
            "EVOLUTIONS: " +
              evoInfo.species.name +
              " > " +
              evoInfo.evolves_to[i].species.name +
              " > " +
              evoInfo.evolves_to[i].evolves_to[i].species.name
          );
        }
      }
    } else {
      console.log(error);
    }
  });
}

function pokeFlavor(flavor_text) {
  var ft = flavor_text;

  for (let i = 0; i < 5; i++) {
    if (ft[i].language.name == "en") {
      console.log("FLAVOR TEXT: " + ft[i].flavor_text);
    }
  }
}

//resultados estão vindo um de cada vez
function showPokemon(poke_name) {
  var pokemon = searchPokemon(poke_name);
  pokemon.then(pokemonData => {
    console.log("NAME: " + pokemonData.name);
    console.log("HEIGHT: " + pokemonData.height / 10 + " m");
    console.log("WEIGHT: " + pokemonData.weight / 10 + " kg");

    pokeType(pokemonData.types);

    var pokemonAddInfo = searchAddInfo(pokemonData.species.url);
    pokemonAddInfo.then(pokemonAddData => {
      pokeGender(pokemonAddData.gender_rate);
      pokeEvolution(pokemonAddData.evolution_chain.url);
      pokeFlavor(pokemonAddData.flavor_text_entries);
    });
  });
}
