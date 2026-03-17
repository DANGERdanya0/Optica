document.addEventListener('DOMContentLoaded', function() {
    // This is a placeholder for a real admin check
    const isAdmin = true; 

    if (isAdmin) {
        // Create and add the admin button to the body
        const adminButton = document.createElement('button');
        adminButton.textContent = 'Admin Panel';
        adminButton.style.position = 'fixed';
        adminButton.style.bottom = '20px';
        adminButton.style.right = '20px';
        adminButton.style.zIndex = '1000';
        adminButton.style.padding = '10px 15px';
        adminButton.id = 'open-admin-panel';
        document.body.appendChild(adminButton);

        const adminModal = document.getElementById('admin-modal');
        const openAdminBtn = document.getElementById('open-admin-panel');
        const closeAdminBtn = adminModal ? adminModal.querySelector('.admin-modal-close') : null;
        const tabButtons = adminModal ? adminModal.querySelectorAll('.admin-tab-btn') : [];
        const tabContents = adminModal ? adminModal.querySelectorAll('.admin-tab-content') : [];

        function openAdminTab(tabId) {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            const tabBtn = document.querySelector(`.admin-tab-btn[data-tab="${tabId}"]`);
            const tabContent = document.getElementById(tabId);

            if (tabBtn) tabBtn.classList.add('active');
            if (tabContent) tabContent.classList.add('active');
        }

        if (openAdminBtn) {
            openAdminBtn.addEventListener('click', () => {
                if (adminModal) {
                    adminModal.classList.add('active');
                    openAdminTab('product-manage-tab'); // Default tab
                    renderProductManagementTab();
                }
            });
        }

        if (closeAdminBtn) {
            closeAdminBtn.addEventListener('click', () => {
                if (adminModal) adminModal.classList.remove('active');
            });
        }

        function setupModalClosing(modal) {
            if (!modal) return;
            let mouseDownOnOverlay = false;
    
            modal.addEventListener('mousedown', (e) => {
                if (e.target === modal) {
                    mouseDownOnOverlay = true;
                }
            });
    
            modal.addEventListener('mouseup', (e) => {
                if (e.target === modal && mouseDownOnOverlay) {
                    modal.classList.remove('active');
                }
                mouseDownOnOverlay = false;
            });
        }
    
        setupModalClosing(adminModal);
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                openAdminTab(tabId);
                 if (tabId === 'product-manage-tab') {
                    renderProductManagementTab();
                }
            });
        });

        function renderProductManagementTab() {
            const container = document.getElementById('product-manage-tab-content');
            if (!container || !window.siteData || !window.siteData.products) return;

            const products = window.siteData.products;
            
            const tableRows = products.map(p => `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>${p.category}</td>
                    <td>${p.price}</td>
                    <td>${p.quantity}</td>
                    <td>
                        <button>Edit</button>
                        <button>Delete</button>
                    </td>
                </tr>
            `).join('');

            container.innerHTML = `
                <h3>Управление товарами</h3>
                <button>Добавить новый товар</button>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Категория</th>
                            <th>Цена</th>
                            <th>Кол-во</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            `;
        }
    }
});
