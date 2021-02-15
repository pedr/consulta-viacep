const findCepElement = document.querySelector("#find-cep");
const cepInfoElement = document.querySelector("#cep-info");

findCepElement.addEventListener("submit", main);

function main(event) {
  console.log('aaa')
  const CEP_INPUT_NAME = "cep";

  const formData = handleCEPSubmit(event);

  const { error, CEP } = validate(formData.get(CEP_INPUT_NAME));

  if (error) {
    return displayError(error);
  }

  displayInfo(CEP);
}

function handleCEPSubmit(event) {
  event.preventDefault();
  const formData = new FormData(findCepElement);
  return formData;
}

function validate(cep) {
  
  if (!cep || cep.length < 8) {
    return { error: "CEP é composto de 8 dígitos", CEP: cep };
  }

  let validatedCep = cep.replace("-", "");

  console.log({validatedCep})

  if (validatedCep.length === 8) {
    if (!isNaN(validatedCep)) {
      return { error: null, CEP: validatedCep };
    }
  }

  return { error: "Não é um CEP válido", CEP: cep  }
}

function displayError(error) {

  cepInfoElement.innerHTML = '';
  const div = document.createElement("div");
  div.textContent = error;
  div.style.color = 'red'
  cepInfoElement.appendChild(div)
}

function displayInfo(cep) {

  function getCEPInfo(cep) {
    const baseURL = "https://viacep.com.br/ws";
    const url = `${baseURL}/${cep}/json`;
    return fetch(url)
      .then((res) => res.json())
      .catch(console.error);
  }

  function generateInfoElement(label, value) {
    const div = document.createElement('div')
    const b = document.createElement('b')
    div.textContent = label + ': ';
    b.textContent = value;
    div.appendChild(b);
    return div;
  }


  cepInfoElement.innerHTML = '';

  getCEPInfo(cep).then(res => {
    const fields = [
      {
        name: 'logradouro',
        label: 'Endereço'
      },
      {
        name: 'bairro',
        label: 'Bairro'
      },
      {
        name: 'localidade',
        label: 'Cidade'
      },
      {
        name: 'ddd',
        label: 'DDD'
      },
      {
        name: 'uf',
        label: 'Estado'
      },
    ];

    fields.map(obj => {
      if (res[obj.name]) {
        cepInfoElement.appendChild(generateInfoElement(obj.label, res[obj.name]))
      }
    })
  })
}
