class BabNotifier {
    constructor() {
        this.def_timer = 2750;
        this.is_open = false;
    }
    notify(initObj) {
        if (typeof initObj != 'object')return;
        if (this.is_open)this.closeNotify();

        var self = this;
        this.is_open = true;

        this.title = initObj.title || '';
        this.body = initObj.body || initObj.text || initObj.html || '';
        this.is_toaster = (initObj.type && initObj.type == 'toaster');

        this.main_holder = this.benga();
        this.main_holder.id = 'main_notif_bg';
        this.main_holder.classList.add('bn_main');
        if (!this.is_toaster)this.main_holder.classList.add('bn_main_fill');

        // Card 
        this.card = this.benga();
        this.card.classList.add(this.is_toaster ? 'bn_toaster' : 'bn_card');
        this.main_holder.appendChild(this.card);

        // container
        this.pop = this.benga();
        this.card.appendChild(this.pop);

        // Add icon if defined
        this.pop.innerHTML = (initObj.icon) ? this.getIcon(initObj.icon) : '';

        let tit = this.benga('h2');
        tit.innerHTML = this.title;
        this.pop.appendChild(tit);

        if (this.body.length > 0) {
            let parag = this.benga('p');
            parag.innerHTML = this.body;
            this.pop.appendChild(parag);
        }

        if (!this.is_toaster) {
            this.animHolder = this.benga();
            this.animHolder.classList.add('bn_progress');
            this.pop.appendChild(this.animHolder);

            this.main_holder.style.background = 'rgba(0, 0, 0, .7)';
        }

        if (initObj.timer || this.is_toaster) {
            this.timer = (initObj.timer) ? Number(initObj.timer) : this.def_timer;
            this.startTimer();
        }

        if (!this.is_toaster) {
            this.main_holder.onclick = (ev) => self.closeNotify();
        } else {
            this.main_holder.style.pointerEvents = 'none';
        }
        document.body.appendChild(this.main_holder);

        // freeze body scroll
        this.freezeBody();
    }
    closeNotify() {
        var self = this;
        if (this.main_holder) {
            this.main_holder.innerHTML = '';
            document.body.removeChild(this.main_holder);
            this.main_holder = null;
        }
        clearTimeout(this.toasterTimer);

        this.is_open = false;

        // restore body scroll
        this.defrostBody();
    }
    startTimer() {
        var self = this;
        this.toasterTimer = setTimeout(function () {
            self.closeNotify();
        }, this.timer);
        if (!this.is_toaster) this.addAnim();
    }
    addAnim() {
        this.animHolder.style.backgroundColor = '#00000022';
        this.animBar = this.benga();
        this.animBar.classList.add('bn_bar');
        this.animHolder.appendChild(this.animBar);
        this.animBar.style.animation = '' + this.timer + 'ms linear bnProgress';
    }
    getIcon(type) {
        let out = '';
        let pre = '<div class="bn_icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">';
        let suf = '</svg></div>';
        if (type == 'error')out = '<path d="M2.20164 18.4695L10.1643 4.00506C10.9021 2.66498 13.0979 2.66498 13.8357 4.00506L21.7984 18.4695C22.4443 19.6428 21.4598 21 19.9627 21H4.0373C2.54022 21 1.55571 19.6428 2.20164 18.4695Z" stroke="indianred" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 9V13" stroke="indianred" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 17.0195V17" stroke="indianred" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>';
        if (type == 'success')out = '<path d="M3 12L9 18L21 6" stroke="#8dc63e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>';
        return pre + out + suf;
    }
    freezeBody() {
        document.body.style.overflow = 'hidden';
    }
    defrostBody() {
        document.body.style.overflow = '';
    }
    benga(_type = 'div') {
        return document.createElement(_type);
    }
}