// Nonaktifkan animasi otomatis jika sistem pengguna meminta reduced motion
jQuery.fx.off = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

$(function () {
    // ----- 1. DROPDOWN NAVBAR (Event: mouseenter/mouseleave, Effect: slideDown/slideUp) -----
    $('.dropdown')
        .on('mouseenter', function () {
            $(this).find('.dropdown-menu').stop(true, true).slideDown(200);
        })
        .on('mouseleave', function () {
            $(this).find('.dropdown-menu').stop(true, true).slideUp(200);
        });

    // ----- 2. TAB MENU INTERAKTIF (Event: click, Effect: fadeIn) -----
    $('.tab-panel').hide().first().show();

    $('.tab').on('click', function () {
        const target = $(this).data('target');
        $('.tab').removeClass('active');
        $(this).addClass('active');
        $('.tab-panel').hide();
        $(target).fadeIn(300);
    });

    // ----- 3. KARTU MENU ANIMATE (Effect: animate) -----
    $('.menu-card')
        .css('position', 'relative')
        .on('mouseenter', function () {
            $(this).stop().animate({ top: '-6px' }, 150);
        })
        .on('mouseleave', function () {
            $(this).stop().animate({ top: '0px' }, 150);
        });

    // ----- 4. FORM PESANAN (Event: focus/blur + Toast) -----
    $('#formPesan .field')
        .on('focus', function () {
            $(this).addClass('is-focus').removeClass('is-error');
            $(this).siblings('.hint').stop(true, true).slideDown(150);
        })
        .on('blur', function () {
            $(this).removeClass('is-focus');
            $(this).siblings('.hint').stop(true, true).slideUp(150);
            if ($(this).hasClass('wajib')) {
                $(this).toggleClass('is-error', $(this).val().trim() === '');
            }
        });

    function tampilkanToast(pesan, tipe) {
        $('#toast')
            .stop(true, true)
            .removeClass('success error')
            .addClass(tipe)
            .text(pesan)
            .fadeIn(250)
            .delay(2500)
            .fadeOut(400);
    }

    $('#formPesan').on('submit', function (e) {
        e.preventDefault();
        const nama = $('#nama').val().trim();
        const menu = $('#pilihMenu').val();

        if (nama === '' || menu === '') {
            $('.wajib').each(function () {
                $(this).toggleClass('is-error', $(this).val().trim() === '');
            });
            tampilkanToast('Lengkapi nama dan produk terlebih dahulu!', 'error');
            return;
        }

        tampilkanToast('Pesanan ' + menu + ' atas nama ' + nama + ' berhasil dikirim!', 'success');
        this.reset();
    });

    // ----- 5. BACK TO TOP BUTTON (Event: scroll, Effect: fadeIn/fadeOut & animate) -----
    const $btnTop = $('#backToTop');
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300) {
            $btnTop.fadeIn(200);
        } else {
            $btnTop.fadeOut(200);
        }
    });

    $btnTop.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 500);
    });

    // ----- 6. FORM VALIDATION PLUGIN & CUSTOM METHOD (Minggu 11) -----
    $.validator.addMethod('nomorHp', function (value, element) {
        return this.optional(element) || /^[0-9]{10,12}$/.test(value);
    }, 'Nomor HP harus 10-12 digit angka');

    // Custom method: password wajib kombinasi huruf DAN angka
    // (tidak boleh huruf semua atau angka semua)
    $.validator.addMethod('hurufAngka', function (value, element) {
        return this.optional(element) || (/[A-Za-z]/.test(value) && /[0-9]/.test(value));
    }, 'Password harus kombinasi huruf dan angka (tidak boleh huruf saja atau angka saja)');

    const validator = $('#formMember').validate({
        rules: {
            nama: { required: true, minlength: 3 },
            email: { required: true, email: true },
            hp: { required: true, nomorHp: true },
            usia: { required: true, digits: true, min: 17 },
            password: { required: true, minlength: 8, hurufAngka: true },
            konfirmasi: { required: true, equalTo: '#mPassword' }
        },
        messages: {
            nama: { required: 'Nama wajib diisi', minlength: 'Nama minimal 3 karakter' },
            email: { required: 'Email wajib diisi', email: 'Format email tidak valid' },
            hp: { required: 'Nomor HP wajib diisi' },
            usia: { required: 'Usia wajib diisi', digits: 'Usia harus angka', min: 'Usia minimal 17 tahun' },
            password: { required: 'Password wajib diisi', minlength: 'Password minimal 8 karakter', hurufAngka: 'Password harus kombinasi huruf dan angka' },
            konfirmasi: { required: 'Konfirmasi password wajib diisi', equalTo: 'Password konfirmasi tidak sama' }
        },
        errorElement: 'div',
        errorClass: 'pesan-error',
        // Pesan error ditaruh setelah keterangan agar keterangan tetap tampil di bawah input
        errorPlacement: function (error, element) {
            error.insertAfter(element.siblings('.keterangan'));
        },
        highlight: function (el) {
            $(el).addClass('is-error').removeClass('is-valid');
        },
        unhighlight: function (el) {
            $(el).removeClass('is-error').addClass('is-valid');
        },
        submitHandler: function (form) {
            const nama = $('#mNama').val().trim();
            tampilkanToast('Selamat datang, ' + nama + '! Akun member berhasil dibuat.', 'success');
            $('#sukses').stop(true, true).slideDown(300).delay(3000).slideUp(300);

            form.reset();
            validator.resetForm();
            $('#formMember input').removeClass('is-error is-valid');
        }
    });

    // ----- 7. SMOOTH SCROLL NAVBAR (klik href="#id" -> scroll halus, bukan lompat) -----
    $('a[href^="#"]').on('click', function (e) {
        const href = $(this).attr('href');
        let posisi;

        if (href === '#') {
            posisi = 0; // link logo: kembali ke atas
        } else {
            const $tujuan = $(href);
            if ($tujuan.length === 0) return;
            // kurangi tinggi navbar sticky agar judul section tidak tertutup
            posisi = $tujuan.offset().top - $('nav').outerHeight();
        }

        e.preventDefault();
        $('html, body').stop(true).animate({ scrollTop: posisi }, 700, 'swing', function () {
            if (href !== '#' && history.pushState) history.pushState(null, '', href);
        });
        $('.dropdown-menu').stop(true, true).slideUp(150); // tutup dropdown setelah klik
    });
});
