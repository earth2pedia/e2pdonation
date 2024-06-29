const express = require('express');
const ethers = require('ethers');

const app = express();
const port = process.env.PORT || 3000;

// Ethereum 네트워크 설정
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/E2Pdono');

// Express 미들웨어 설정
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// 메인 페이지 렌더링
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 트랜잭션 전송 API 엔드포인트
app.post('/sendTransaction', async (req, res) => {
  try {
    const { toAddress, amount } = req.body;

    // MetaMask를 통해 연결된 계정 가져오기
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner(accounts[0]);

    // 이더 전송
    const tx = await signer.sendTransaction({
      to: toAddress,
      value: ethers.utils.parseEther(amount),
    });

    console.log('Transaction Hash:', tx.hash);
    res.redirect('/success'); // 성공 페이지로 리다이렉트
  } catch (error) {
    console.error('Error sending transaction:', error);
    res.status(500).send('Error sending transaction');
  }
});

// 성공 페이지 렌더링
app.get('/success', (req, res) => {
  res.sendFile(__dirname + '/public/success.html');
});

// 오류 페이지 렌더링
app.get('/error', (req, res) => {
  res.sendFile(__dirname + '/views/error.html');
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
