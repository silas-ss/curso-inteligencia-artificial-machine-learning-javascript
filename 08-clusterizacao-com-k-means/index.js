let eixoX = []
let eixoY = []

let grupos = 2

let centroidesX = []
let centroidesY = []

let grupoID_Anterior = []

function mediaGrupoX(IDs=[], grupoIDs=0) {
  let soma = 0
  let qtdGrupo = 0
  for(let i=0; i<IDs.length; i++) {
    if(IDs[i] == grupoIDs) {
      soma += eixoX[i]
      qtdGrupo++
    }
  }
  return soma / qtdGrupo
}

function mediaGrupoY(IDs=[], grupoIDs=0) {
  let soma = 0
  let qtdGrupo = 0
  for(let i=0; i<IDs.length; i++) {
    if(IDs[i] == grupoIDs) {
      soma += eixoY[i]
      qtdGrupo++
    }
  }
  return soma / qtdGrupo
}

function atualizaCentroideX() {
  if (centroidesX.length <= 0) {
    centroidesX[0] = eixoX[0]
    for (let i=1; i<grupos; i++) {
      centroidesX[i] = eixoX[(eixoX.length-1)-i]
    }
  } else {
    for (let i=0; i<grupos; i++) {
      centroidesX[i] = mediaGrupoX(grupoID_Anterior, i)
    }
  }
}

function atualizaCentroideY() {
  if (centroidesY.length <= 0) {
    centroidesY[0] = eixoY[0]
    for (let i=1; i<grupos; i++) {
      centroidesY[i] = eixoY[(eixoY.length-1)-i]
    }
  } else {
    for (let i=0; i<grupos; i++) {
      centroidesY[i] = mediaGrupoY(grupoID_Anterior, i)
    }
  }
}

function minimo(arr=[]) {
  Array.prototype.min = function () {
    return Math.min.apply(null, this)
  }
  return arr.min()
}

function grupo(distancias=[], menorDistancia=0) {
  return distancias.indexOf(menorDistancia);
}

function comparaGrupos(arr1=[], arr2=[]) {
  let retorno = true
  for(let i=0; i<arr1.length; i++) {
    if (arr1[i] != arr2[i]) {
      retorno = false
    }
  }
  return retorno
}

function atualizaGrupo() {
  atualizaCentroideX()
  atualizaCentroideY()

  let retorno = true
  let grupoID = []
  let distancias = []
  let distanciasMenores = []

  for(let i=0; i<eixoX.length; i++) {
    for(let j=0; j<grupos; j++) {
      distancias[j] = Math.sqrt(Math.pow(eixoX[i] - centroidesX[j], 2) + Math.pow(eixoY[i] - centroidesY[j], 2))
    }

    distanciasMenores[i] = minimo(distancias)
    grupoID[i] = grupo(distancias, distanciasMenores[i])
  }
  
  if (grupoID_Anterior.length <= 0) {
    grupoID_Anterior = grupoID
  } else {
    if (comparaGrupos(grupoID_Anterior, grupoID)) {
      retorno = false
    } else {
      grupoID_Anterior = grupoID
      retorno = true
    }
  }

  return retorno
}

function retornaElementosGrupo(arrGrupos=[]) {
  let matrizGrupos = []
  for(let i=0; i<grupos; i++) {
    let divisaoGrupos = []
    for(let j=0; j<arrGrupos.length; j++) {
      if (arrGrupos[j] == i) {
        divisaoGrupos.push([eixoX[j], eixoY[j]])
      }
    }

    matrizGrupos.push(divisaoGrupos)
  }

  return matrizGrupos
}

function train(config={}) {
  if (config.x) eixoX = config.x
  else eixoX = []
  if (config.y) eixoY = config.y
  else eixoY = []
  if (config.groups) grupos = config.groups
  else grupos = 2
}

function predict() {
  centroidesX = []
  centroidesY = []
  grupoID_Anterior = []

  if ((grupos > 1) && (grupos < eixoX.length)) {
    if (eixoX.length > 2) {
      while(atualizaGrupo()) {}
      const matriz = retornaElementosGrupo(grupoID_Anterior)
      return matriz
    } else {
      return []
    }
  } else {
    return []
  }
}

train({
  x: [1,2,5,25,45,65],
  y: [2,4,6,35,55,75],
  groups: 2
})

console.log(predict())