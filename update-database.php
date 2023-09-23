<?php
// Kết nối đến cơ sở dữ liệu MySQL
$servername = "localhost"; // Thay thế bằng tên máy chủ cơ sở dữ liệu của bạn
$username = "root"; // Thay thế bằng tên người dùng cơ sở dữ liệu của bạn
$password = ""; // Thay thế bằng mật khẩu cơ sở dữ liệu của bạn
$database = "rate"; // Thay thế bằng tên cơ sở dữ liệu của bạn

// Kết nối đến cơ sở dữ liệu MySQL
$conn = new mysqli($servername, $username, $password, $database);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối đến cơ sở dữ liệu thất bại: " . $conn->connect_error);
}

// Nhận dữ liệu XML từ yêu cầu POST
$xmlData = file_get_contents("php://input");

// Phân tích dữ liệu XML
$xml = simplexml_load_string($xmlData);

// Trích xuất danh sách Exrate từ XML và lưu vào cơ sở dữ liệu
foreach ($xml->Exrate as $exrate) {
    $dateTime = $xml->DateTime;
    $currencyCode = $exrate['CurrencyCode'];
    $currencyName = $exrate['CurrencyName'];
    $buy = $exrate['Buy'];
    $transfer = $exrate['Transfer'];
    $sell = $exrate['Sell'];

    // Sử dụng prepared statement để cập nhật dữ liệu vào cơ sở dữ liệu
    $stmt = $conn->prepare("INSERT INTO exchange_rates (DateTime, CurrencyCode, CurrencyName, Buy, Transfer, Sell) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $dateTime, $currencyCode, $currencyName, $buy, $transfer, $sell);

    if ($stmt->execute()) {
        echo "Dữ liệu đã được cập nhật thành công vào cơ sở dữ liệu";
    } else {
        echo "Lỗi khi cập nhật dữ liệu: " . $stmt->error;
    }

    // Đóng prepared statement
    $stmt->close();
}

// Đóng kết nối đến cơ sở dữ liệu MySQL
$conn->close();
?>
