let entradas = []
let classes = []

function eliminaDuplicados(arr=[]) {
  arr = [...new Set(arr)]
  return arr
}

function retornaClasses() {
  let arr = classes
  arr = eliminaDuplicados(arr)
  return arr
}

function contaTexto(texto='', procura='') {
  return texto.split(procura).length - 1
}

function organizar() {
  let params = {}
  
  for (let i=0; i<entradas.length; i++) {
    let carac = ''
    if (i<(entradas.length-1)) carac = '-'

    if (params[classes[i]]) {
      params[classes[i]] += entradas[i] + carac
    } else {
      params[classes[i]] = entradas[i] + carac
    }
  }

  let str = JSON.stringify(params)
  str = str.replace(/-"/g, '"')
  str = str.replace(/-/g, ',')
  params = JSON.parse(str)

  return params
}

function frequencia() {
  let categorias = []
  let params = {}
  const objeto = organizar()
  const labels = retornaClasses()
  
  for(let i=0; i<entradas.length; i++) {
    params['Entrada'] = entradas[i]

    for(let j=0; j<labels.length; j++) {
      params[labels[j]] = contaTexto(objeto[labels[j]], entradas[i])
    }
    categorias[i] = JSON.stringify(params)
  }

  categorias = eliminaDuplicados(categorias)

  for(let i=0; i<categorias.length; i++) {
    categorias[i] = JSON.parse(categorias[i])
  }

  return categorias
}

function quantidadeClasses() {
  const categorias = frequencia()
  return parseInt(Object.keys(categorias[0]).length - 1)
}

function somaClasses(arr=[]) {
  let soma = 0
  for(let i=1; i<arr.length; i++) {
    soma += parseInt(arr[i])
  }
  return soma
}

function totalPorClasse() {
  let totalClasse = []
  const nomeClasses = retornaClasses()
  const str_classes = JSON.stringify(classes)

  for(let i=0; i<nomeClasses.length; i++) {
    totalClasse[nomeClasses[i]] = contaTexto(str_classes, nomeClasses[i])
  }

  return totalClasse
}

function somaTotaisClasses() {
  const vetTemp = Object.values(totalPorClasse())
  let soma = 0
  for (let i=0; i<vetTemp.length; i++) {
    soma += parseFloat(vetTemp[i])
  }
  return soma
}

function ocorrenciaClasseParaEntrada(_entrada='', _classe='') {
  const categorias = frequencia()
  let retorno = 0

  categorias.forEach((item) => {
    if (item['Entrada'] == _entrada) {
      retorno = parseFloat(item[_classe])
    }
  })
  return retorno
}

function NaiveBayes(_entrada='') {
  const nomeClasses = retornaClasses()
  const totalClasse = totalPorClasse()

  const categorias = frequencia()
  var soma = 0
  categorias.forEach((item) => {
    if (item['Entrada'] == _entrada) {
      for(let i=0; i<nomeClasses.length; i++) {
        soma += parseFloat(item[nomeClasses[i]])
      }
    }
  })

  let probabilidade = []

  for (let i=0; i<nomeClasses.length; i++) {
    probabilidade[nomeClasses[i]] = 
    (ocorrenciaClasseParaEntrada(_entrada, nomeClasses[i]) / totalClasse[nomeClasses[i]])
    *
    (totalClasse[nomeClasses[i]] / somaTotaisClasses())
    /
    (soma / somaTotaisClasses())
  }

  return probabilidade
}

function train(config={}) {
  if (config.input) entradas = config.input
  else entradas = ['']
  if (config.output) classes = config.output
  else classes = ['']
}

function predict(selEntrada='') {
  const nomeClasses = retornaClasses()
  let probabilidades = []
  if (selEntrada.toString().trim().length > 0) {
    const Naive = NaiveBayes(selEntrada)

    for(let i=0; i<nomeClasses.length; i++) {
      const percentual = Number(parseFloat(Naive[nomeClasses[i]] * 100).toFixed(2))
      probabilidades.push({ class: nomeClasses[i], probability: percentual })
    }
  } else {
    probabilidades.push({ class: '', probability: 0 })
  }

  return probabilidades
}

train({
  input: ['bom','mau', 'indiferente', 'indiferente'],
  output: ['positivo', 'negativo', 'positivo', 'negativo']
})

console.log(predict('indiferente'))