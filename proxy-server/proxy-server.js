const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000; // Chọn một cổng tuỳ ý
const xml2js = require('xml2js');

app.use(express.json());

app.get('/exchange-rates', async (req, res) => {
    try {
        // Gửi yêu cầu đến trang web khác để lấy dữ liệu (ví dụ: Vietcombank)
        const response = await axios.get('https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx');

        // Sử dụng xml2js để chuyển đổi dữ liệu XML thành đối tượng JavaScript
        xml2js.parseString(response.data, (err, result) => {
            if (err) {
                console.error('Lỗi khi chuyển đổi XML:', err);
                res.status(500).json({ error: 'Lỗi khi xử lý dữ liệu XML' });
            } else {
                res.json(result);
            }
        });
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu đến Vietcombank:', error);
        res.status(500).json({ error: 'Lỗi khi truy cập Vietcombank' });
    }
});

app.listen(port, () => {
    console.log(`Máy chủ proxy đang lắng nghe tại http://localhost:${port}`);
});
