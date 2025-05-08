function calcularIMC() {
    // Obtém os valores de peso e altura do formulário
    const peso = parseFloat(document.getElementById("peso").value);
    const altura = parseFloat(document.getElementById("altura").value);
    const resultadoDiv = document.getElementById("resultado");
    const categoriaDiv = document.getElementById("categoria");

    // Verifica se os valores são válidos
    if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
        resultadoDiv.textContent = "Por favor, insira valores válidos para peso e altura.";
        categoriaDiv.textContent = "";
        return;
    }

    // Calcula o IMC
    const imc = peso / (altura * altura);

    // Determina a categoria do IMC
    let categoria = "";
    if (imc < 18.5) {
        categoria = "Abaixo do peso";
    } else if (imc >= 18.5 && imc < 24.9) {
        categoria = "Peso normal";
    } else if (imc >= 25 && imc < 29.9) {
        categoria = "Sobrepeso";
    } else {
        categoria = "Obesidade";
    }

    // Exibe o resultado e a categoria
    resultadoDiv.textContent = `Seu IMC é ${imc.toFixed(2)}.`;
    categoriaDiv.textContent = `Categoria: ${categoria}`;
}
