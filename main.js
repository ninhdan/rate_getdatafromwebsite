

function fetchDataAndDisplay() {
    // Gửi yêu cầu đến máy chủ proxy và xử lý dữ liệu
    fetch('http://localhost:3000/exchange-rates')
    .then(response => response.text()) // Lấy dữ liệu dưới dạng văn bản
    .then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const exchangeRatesTable = document.getElementById('exchangeRatesTable');
        const dateTimeElement = xmlDoc.querySelector('DateTime');
        const dateTimeDisplay = document.getElementById('dateTimeDisplay');
        const dateTime = dateTimeElement.textContent;
        //dateTimeDisplay.innerHTML = `Time Update form VietComBank: ${dateTime}`;

        const sourceElement = xmlDoc.querySelector('Source');
        const sourceDisplay = document.getElementById('soucre');
        const source = sourceElement.textContent;

        sourceDisplay.textContent = `${source}`;

        // Lấy thời gian hiện tại và thêm 10 phút để tính thời gian kế tiếp
        const currentTime = new Date();
        const nextRunTime = new Date(currentTime.getTime() + 600000); // 600000 milliseconds = 10 phút
     
        // Định dạng thời gian thành chuỗi
        const currentTimeString = `Thời gian hiện tại: ${currentTime.toLocaleTimeString()}`;
        const nextRunTimeString = `Thời gian kế tiếp: ${nextRunTime.toLocaleTimeString()}`;
     
        // Hiển thị cả hai thời gian trong cùng một đối tượng HTML
        dateTimeDisplay.innerHTML = `<p><strong>Time Run Update form VietComBank: </strong> ${dateTime}</p><p><strong>Time Run Update :</strong> ${nextRunTimeString} </p> <p><strong>Time now:</strong> ${currentTimeString} </p>`;

        const exrates = xmlDoc.querySelectorAll('Exrate');

        // Tạo hàng trong bảng cho mỗi Exrate
        exrates.forEach(exrate => {
            const currencyName = exrate.getAttribute('CurrencyName');
            const currencyCode = exrate.getAttribute('CurrencyCode');
            const Transfer = exrate.getAttribute('Transfer');
            const Sell = exrate.getAttribute('Sell');
            const buyRate = exrate.getAttribute('Buy');
            const row = document.createElement('tr');
            const codeCell = document.createElement('td');
            const nameCell = document.createElement('td');
            const buyCell = document.createElement('td');
            const transferCell = document.createElement('td');
            const sellCell = document.createElement('td');
            codeCell.textContent = currencyCode;
            nameCell.textContent = currencyName;
            buyCell.textContent = buyRate;
            transferCell.textContent = Transfer;
            sellCell.textContent = Sell;
            row.appendChild(codeCell);
            row.appendChild(nameCell);
            row.appendChild(buyCell);
            row.appendChild(transferCell);
            row.appendChild(sellCell);
            exchangeRatesTable.appendChild(row);

             // Cập nhật thời gian hiển thị
             updateNextRunTime();
             sendDataToServer(xmlDoc);
        });
    })
    .catch(error => console.error('Lỗi khi truy cập máy chủ proxy:', error));
}
function updateNextRunTime() {

    setTimeout(fetchDataAndDisplay, 600000); // 600000 milliseconds = 10 phút
}

function sendDataToServer(xmlData) {
    // Chuyển đổi dữ liệu XML thành chuỗi và gửi đến máy chủ PHP
    const xmlString = new XMLSerializer().serializeToString(xmlData);
    
    fetch('update-database.php', {
        method: 'POST',
        body: xmlString,
        headers: {
            'Content-Type': 'application/xml'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Dữ liệu đã được cập nhật thành công vào cơ sở dữ liệu');
        } else {
            console.error('Lỗi khi gửi dữ liệu đến máy chủ PHP');
        }
    })
    .catch(error => console.error('Lỗi khi gửi dữ liệu đến máy chủ PHP:', error));
}

fetchDataAndDisplay();  