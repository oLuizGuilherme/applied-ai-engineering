import tf from '@tensorflow/tfjs-node';

async function trainModel(inputXs, outputYs) {
    // Criamos um modelo sequencial simples
    const model = tf.sequential()
    model.add(tf.layers.dense({ inputShape: [7], units: 80, activation: 'relu' }))
    model.add(tf.layers.dense({ units: 3, activation: 'softmax' }))
    
    model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] })

    await model.fit(
        inputXs,
        outputYs,
        {
            verbose: 0,
            epochs: 100,
            shuffle: true,
            callbacks: {
                // onEpochEnd: (epoch, logs) => {
                //     console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`)
                // }
            }
        }
    )

    // Treinamos o modelo por 100 épocas
    return model
}

async function predict(model, inputXs) {
    const tfInput = tf.tensor2d(inputXs)
    
    const predictions = model.predict(tfInput)
    const predictionsArray = await predictions.array()
    return predictionsArray[0].map((probabilities, index) => ({probabilities, index}))
}

// Usamos apenas os dados numéricos, como a rede neural só entende números.
// tensorPessoasNormalizado corresponde ao dataset de entrada do modelo.
const tensorPessoasNormalizado = [
    [0.33, 1, 0, 0, 1, 0, 0], // Erick
    [0, 0, 1, 0, 0, 1, 0],    // Ana
    [1, 0, 0, 1, 0, 0, 1]     // Carlos
]

// Labels das categorias a serem previstas (one-hot encoded)
// [premium, medium, basic]
const labelsNomes = ["premium", "medium", "basic"]; // Ordem dos labels
const tensorLabels = [
    [1, 0, 0], // premium - Erick
    [0, 1, 0], // medium - Ana
    [0, 0, 1]  // basic - Carlos
];

// Criamos tensores de entrada (xs) e saída (ys) para treinar o modelo
const inputXs = tf.tensor2d(tensorPessoasNormalizado)
const outputYs = tf.tensor2d(tensorLabels)

const model = await trainModel(inputXs, outputYs)

const person = { nome: "Zé", idade: 28, cor: "verde", localizacao: "Curitiba" }

// Normalizar pessoa
// idade - idade_min / idade_max - idade_min

const tensorPersonNormalized = [
    [0.2, 1, 0, 0, 0, 1, 0]
]

const predictions = await predict(model, tensorPersonNormalized)
const result = predictions
    .sort((a, b) => b.probabilities - a.probabilities)
    .map(p => `${labelsNomes[p.index]} (${(p.probabilities * 100).toFixed(2)}%)`)
    .join('\n')

console.log(result)
