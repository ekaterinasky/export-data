let csv = document.getElementById('csv');
let button = document.getElementById('btn');

csv.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const content = e.target.result;
        const rows = content.split('\n').map(row => row.split(','));

        const table = document.getElementById('table');
        table.innerHTML = '';

        for (let i = 0; i < rows.length; i++) {
            let tr = document.createElement('tr');
            for (let j = 0; j < rows[i].length; j++) {
                let td = document.createElement('td');
                td.textContent = rows[i][j];
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        csv.style.display = 'none';
        button.style.display = 'block';
    }

    reader.readAsText(file);
});

button.addEventListener('click', () => {
    const rows = document.querySelectorAll('#table tr');
    let csvContent = '';

    // Собираем CSV-строки из таблицы
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let cols = row.querySelectorAll('td');
        let rowContent = '';

        for (let j = 0; j < cols.length; j++) {
            let col = cols[j];
            rowContent += col.textContent + ',';
        }
        // Убираем последнюю запятую и добавляем перенос строки
        csvContent += rowContent.slice(0, -1) + '\n';
    }

    // Создаем Blob (бинарный объект) с CSV-данными
    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Создаем временную ссылку для скачивания
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob); // Генерируем URL для Blob

    a.href = url;
    a.download = 'exported_data.csv'; // Имя файла
    document.body.appendChild(a); // Добавляем ссылку в DOM (необходимо для Firefox)
    a.click(); // Программно "кликаем" по ссылке

    // Убираем ссылку после скачивания
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url); // Освобождаем память
    }, 100);
});