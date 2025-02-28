// 图片加载优化和下载管理
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.coloring-image');
    const downloadLimits = {}; // 用于存储下载限制
    const downloadCounts = {}; // 用于存储下载统计
    
    // 为每个图片添加加载动画
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.addEventListener('load', function() {
            img.style.opacity = '1';
        });
        
        if (img.complete) {
            img.style.opacity = '1';
        }
    });

    // 生成简单的验证码
    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        return {
            question: `${num1} + ${num2} = ?`,
            answer: num1 + num2
        };
    }

    // 创建验证码对话框
    function createCaptchaDialog() {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
        `;
        return dialog;
    }

    // 下载按钮点击效果和验证
    const downloadButtons = document.querySelectorAll('.download-options a');
    downloadButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // 检查下载频率限制
            const now = Date.now();
            const lastDownload = downloadLimits[button.href] || 0;
            if (now - lastDownload < 30000) { // 30秒内不能重复下载
                alert('请等待30秒后再次下载');
                return;
            }

            // 验证码验证
            const captcha = generateCaptcha();
            const dialog = createCaptchaDialog();
            dialog.innerHTML = `
                <h3 style="margin-bottom: 10px;">请完成验证</h3>
                <p>${captcha.question}</p>
                <input type="number" id="captchaInput" style="margin: 10px 0; padding: 5px;">
                <button id="submitCaptcha" style="padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">确认</button>
            `;
            document.body.appendChild(dialog);

            // 处理验证码提交
            const submitButton = dialog.querySelector('#submitCaptcha');
            const input = dialog.querySelector('#captchaInput');

            submitButton.addEventListener('click', () => {
                const userAnswer = parseInt(input.value);
                if (userAnswer === captcha.answer) {
                    // 更新下载限制和统计
                    downloadLimits[button.href] = now;
                    downloadCounts[button.href] = (downloadCounts[button.href] || 0) + 1;
                    
                    // 添加下载动画效果
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                        // 触发实际下载
                        const link = document.createElement('a');
                        link.href = button.href;
                        link.download = button.getAttribute('download');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }, 100);

                    // 移除验证码对话框
                    document.body.removeChild(dialog);
                } else {
                    alert('验证码错误，请重试');
                }
            });
        });
    });

    // 分类按钮点击事件
    const animalButton = document.getElementById('animal-button');
    const personButton = document.getElementById('person-button');
    const coloringPages = document.querySelectorAll('.coloring-page');
    const enlargeModal = document.getElementById('enlarge-modal');
    const closeButton = document.getElementsByClassName("close")[0];
    const enlargeImg = document.getElementById('enlarge-img');

    if (animalButton) {
        animalButton.addEventListener('click', () => {
            coloringPages.forEach(page => {
                if (page.classList.contains('animal')) {
                    page.style.display = 'block';
                } else {
                    page.style.display = 'none';
                }
            });
        });
    }

    if (personButton) {
        personButton.addEventListener('click', () => {
            coloringPages.forEach(page => {
                if (page.classList.contains('person')) {
                    page.style.display = 'block';
                } else {
                    page.style.display = 'none';
                }
            });
        });
    }

    const coloringImages = document.querySelectorAll('.coloring-image');
    coloringImages.forEach(img => {
        img.addEventListener('click', function () {
            const enlargedSrc = this.dataset.enlargedSrc;
            enlargeImg.src = enlargedSrc;
            enlargeModal.style.display = "block";
        });
    });

    closeButton.addEventListener('click', function () {
        enlargeModal.style.display = "none";
    });

    window.addEventListener('click', function (event) {
        if (event.target === enlargeModal) {
            enlargeModal.style.display = "none";
        }
    });
});