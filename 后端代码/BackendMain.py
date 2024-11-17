# 需要先安装 muggle_ocr，步骤：
# 1. git clone https://github.com/litongjava/muggle_ocr.git
# 2. cd muggle_ocr文件夹
# 3. pip install -r .\requirements.txt
# 4. python setup.py install

from flask import Flask, request, jsonify, Response
import os
import muggle_ocr

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from redis import Redis

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # 仅显示错误信息
app = Flask(__name__)
sdk = muggle_ocr.SDK(model_type=muggle_ocr.ModelType.Captcha)

limiter = Limiter(get_remote_address, app=app, storage_uri="redis://:@Youziyv1@localhost:6379/10")

@app.errorhandler(429)
def ratelimit_error(error):
    return jsonify(error="被请求给塞满了", message="我不是免费验证码接口！"), 429

@app.route('/captcha', methods=['POST'])
@limiter.limit("30 per hour")
def captcha():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image = request.files['image']
    captcha = sdk.predict(image.read())
#    return captcha, 200
    response = Response(captcha, status=200)

    # 添加 Access-Control-Allow-Origin 头部
    response.headers['Access-Control-Allow-Origin'] = 'https://bksy.bjtu.edu.cn'

    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=2345)