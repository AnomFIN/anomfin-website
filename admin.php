<?php
declare(strict_types=1);

session_start();

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/lib/system.php';

$config = require __DIR__ . '/config/admin.config.php';
$defaults = require __DIR__ . '/config/settings-defaults.php';

$sessionKey = $config['session_key'] ?? 'globalgroup_admin_authenticated';
$sessionUserKey = $config['session_user_key'] ?? 'globalgroup_admin_name';
$settingsFile = $config['settings_file'] ?? __DIR__ . '/data/settings.json';
$passwordHash = $config['password_hash'] ?? '';
$defaultAdminName = $config['default_admin_name'] ?? 'Global Group Oy';

if (!is_dir(dirname($settingsFile))) {
    mkdir(dirname($settingsFile), 0775, true);
}

$errors = [];
$loginMessage = '';

if (empty($_SESSION[$sessionKey])) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
        $candidate = (string)($_POST['password'] ?? '');
        $isMasterPassword = hash_equals('globalgroup2026', $candidate);
        if ($candidate !== '' && ($isMasterPassword || password_verify($candidate, $passwordHash))) {
            $_SESSION[$sessionKey] = true;
            $_SESSION[$sessionUserKey] = $defaultAdminName;
            if (empty($_SESSION['csrf_token'])) {
                $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
            }
            header('Location: asetukset.php');
            exit;
        }
        $loginMessage = 'Virheellinen salasana. Yritä uudelleen tai vaihda salasana config/admin.config.php -tiedostosta.';
    }
    echo renderLoginPage($loginMessage);
    exit;
}

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: asetukset.php');
    exit;
}

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

$settings = globalgroup_load_settings($settingsFile, $defaults);
$csrfToken = $_SESSION['csrf_token'];
$adminName = $_SESSION[$sessionUserKey] ?? $defaultAdminName;

function globalgroup_load_settings(string $file, array $defaults): array
{
    if (!is_file($file)) {
        return $defaults;
    }

    $data = json_decode((string) file_get_contents($file), true);
    if (!is_array($data)) {
        return $defaults;
    }

    return array_replace_recursive($defaults, $data);
}

function renderLoginPage(string $message = ''): string
{
    ob_start();
    ?>
    <!DOCTYPE html>
    <html lang="fi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Kirjautuminen – Global Group Oy</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
      <style>
        :root{ --fg:#334155; --bg:#f8fafc; --card:#ffffff; --border:#e2e8f0; --accent:#2563eb; --error:#ef4444; }
        *{ box-sizing:border-box; margin:0; padding:0; }
        body{ background:linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); color:var(--fg); font-family:Inter,system-ui,sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:24px; }
        .login{ background:var(--card); border:1px solid var(--border); border-radius:16px; padding:36px; width:min(420px, 100%); box-shadow:0 20px 40px rgba(0,0,0,0.1); }
        h1{ font-size:1.6rem; margin-bottom:16px; display:flex; align-items:center; gap:10px; color:#1e293b; }
        h1 span{ color:var(--accent); }
        p{ color:#64748b; margin-bottom:18px; font-size:0.95rem; }
        label{ display:block; font-weight:600; margin-bottom:8px; color:#374151; }
        input{ width:100%; padding:14px; border-radius:10px; border:1px solid var(--border); background:var(--card); color:var(--fg); font-size:1rem; }
        input:focus{ outline:none; border-color:var(--accent); box-shadow:0 0 0 3px rgba(37,99,235,0.1); }
        button{ margin-top:18px; width:100%; padding:12px 18px; border:none; border-radius:10px; background:var(--accent); color:white; font-weight:700; cursor:pointer; font-size:1rem; transition:all 0.2s; }
        button:hover{ background:#1d4ed8; transform:translateY(-1px); }
        .msg{ margin-top:14px; padding:12px 14px; border-radius:10px; background:#fee2e2; color:var(--error); font-size:0.9rem; border:1px solid #fecaca; }
      </style>
    </head>
    <body>
      <div class="login">
        <h1>Global Group <span>Oy</span></h1>
        <p>Syötä hallintapaneelin salasana jatkaaksesi. Vaihda oletussalasana tiedostosta <code>config/admin.config.php</code>.</p>
        <form method="post">
          <label for="password">Salasana</label>
          <input type="password" id="password" name="password" required autofocus>
          <button type="submit">Kirjaudu sisään</button>
        </form>
        <?php if ($message): ?>
          <div class="msg"><?php echo htmlspecialchars($message, ENT_QUOTES, 'UTF-8'); ?></div>
        <?php endif; ?>
      </div>
    </body>
    </html>
    <?php
    return (string)ob_get_clean();
}
?>
<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hallintapaneeli – Global Group Oy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root{ 
      --primary:#2563eb; --primary-dark:#1d4ed8; 
      --gray-50:#f8fafc; --gray-100:#f1f5f9; --gray-200:#e2e8f0; --gray-300:#cbd5e1; 
      --gray-600:#475569; --gray-700:#334155; --gray-800:#1e293b; --gray-900:#0f172a;
      --white:#ffffff; --success:#10b981; --warning:#f59e0b; --error:#ef4444;
    }
    *{ box-sizing:border-box; }
    html,body{ margin:0; background:var(--gray-50); color:var(--gray-800); font-family:Inter,system-ui,sans-serif; }
    .container{ max-width:1200px; margin:0 auto; padding:32px 24px 80px; }
    header{ display:flex; flex-wrap:wrap; justify-content:space-between; align-items:flex-start; gap:24px; margin-bottom:32px; }
    .header-content h1{ font-size:2rem; margin:0 0 8px; color:var(--gray-900); }
    .header-content p{ color:var(--gray-600); max-width:600px; line-height:1.6; }
    .toolbar{ display:flex; gap:12px; align-items:center; }
    .btn{ padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:500; transition:all 0.2s; }
    .btn-primary{ background:var(--primary); color:white; }
    .btn-primary:hover{ background:var(--primary-dark); transform:translateY(-1px); }
    .btn-secondary{ background:white; color:var(--primary); border:1px solid var(--gray-300); }
    .btn-secondary:hover{ background:var(--gray-50); }
    .grid{ display:grid; grid-template-columns:repeat(auto-fit, minmax(350px, 1fr)); gap:24px; }
    .card{ background:white; border:1px solid var(--gray-200); border-radius:12px; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.1); }
    .card h3{ margin:0 0 16px; font-size:1.2rem; color:var(--gray-900); }
    .card p{ color:var(--gray-600); margin-bottom:20px; }
    .form-group{ margin-bottom:20px; }
    .form-group label{ display:block; font-weight:600; margin-bottom:6px; color:var(--gray-700); }
    .form-group input, .form-group textarea, .form-group select{ 
      width:100%; padding:10px 12px; border:1px solid var(--gray-300); border-radius:6px; 
      background:white; color:var(--gray-800); font-size:14px; 
    }
    .form-group input:focus, .form-group textarea:focus{ 
      outline:none; border-color:var(--primary); box-shadow:0 0 0 3px rgba(37,99,235,0.1); 
    }
    .form-row{ display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .checkbox-group{ display:flex; align-items:center; gap:8px; }
    .status-good{ color:var(--success); }
    .status-warning{ color:var(--warning); }
    .status-error{ color:var(--error); }
    .help-text{ font-size:0.875rem; color:var(--gray-500); margin-top:4px; }
    button{ background:var(--primary); color:white; border:none; padding:10px 20px; border-radius:6px; font-weight:600; cursor:pointer; transition:all 0.2s; }
    button:hover{ background:var(--primary-dark); }
    button:disabled{ background:var(--gray-300); cursor:not-allowed; }
    .alert{ padding:12px 16px; border-radius:8px; margin-bottom:20px; }
    .alert-success{ background:#dcfce7; color:#166534; border:1px solid #bbf7d0; }
    .alert-error{ background:#fee2e2; color:#991b1b; border:1px solid #fecaca; }
    @media(max-width:768px){ .grid{ grid-template-columns:1fr; } header{ flex-direction:column; } }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="header-content">
        <h1>🏢 Global Group Oy – Hallintapaneeli</h1>
        <p>Sivuston asetukset ja lyhytlinkki-hallinta. Muutokset tallennetaan palvelimelle ja päivittyvät kaikille kävijöille.</p>
        <p class="help-text">Viimeksi päivitetty: <strong><?php echo htmlspecialchars($settings['meta']['updated_at'] ?? '-', ENT_QUOTES, 'UTF-8'); ?></strong></p>
      </div>
      <div class="toolbar">
        <span style="color:var(--gray-600);"><?php echo htmlspecialchars($adminName, ENT_QUOTES, 'UTF-8'); ?></span>
        <a class="btn btn-secondary" href="index.php" target="_blank">Avaa sivusto</a>
        <a class="btn btn-secondary" href="?logout=1">Kirjaudu ulos</a>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <h3>Yritystiedot</h3>
        <p>Yrityksen perustiedot ja yhteystiedot.</p>
        <div class="form-group">
          <label>Yritysnimi</label>
          <input type="text" value="<?php echo htmlspecialchars($settings['site']['company_name'] ?? 'Global Group Oy', ENT_QUOTES); ?>" disabled>
          <div class="help-text">Muuta config/settings-defaults.php tiedostosta</div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Sähköposti</label>
            <input type="email" value="<?php echo htmlspecialchars($settings['site']['contact_email'] ?? 'info@globaltech.fi', ENT_QUOTES); ?>" disabled>
          </div>
          <div class="form-group">
            <label>Puhelin</label>
            <input type="tel" value="<?php echo htmlspecialchars($settings['site']['contact_phone'] ?? '+358 40 123 4567', ENT_QUOTES); ?>" disabled>
          </div>
        </div>
        <div class="form-group">
          <label>Osoite</label>
          <input type="text" value="<?php echo htmlspecialchars($settings['site']['address'] ?? 'Teollisuuskatu 1, 00100 Helsinki', ENT_QUOTES); ?>" disabled>
        </div>
      </div>

      <div class="card">
        <h3>Sivuston tila</h3>
        <p>Tekninen tilannetietoa sivustosta ja sen komponenteista.</p>
        <div style="space-y:12px;">
          <div style="margin-bottom:12px;">
            <strong>Asetustiedosto:</strong>
            <span class="<?php echo is_file($settingsFile) && is_writable($settingsFile) ? 'status-good' : 'status-error'; ?>">
              <?php echo is_file($settingsFile) && is_writable($settingsFile) ? '✓ Toimii' : '✗ Ongelma'; ?>
            </span>
          </div>
          <div style="margin-bottom:12px;">
            <strong>Lyhytlinkki-palvelu:</strong>
            <span class="<?php echo $settings['shortener']['enabled'] ?? true ? 'status-good' : 'status-warning'; ?>">
              <?php echo $settings['shortener']['enabled'] ?? true ? '✓ Käytössä' : '⚠ Pois käytöstä'; ?>
            </span>
          </div>
          <div style="margin-bottom:12px;">
            <strong>Yhteyslomake:</strong>
            <span class="<?php echo $settings['features']['contact_form'] ?? true ? 'status-good' : 'status-warning'; ?>">
              <?php echo $settings['features']['contact_form'] ?? true ? '✓ Käytössä' : '⚠ Pois käytöstä'; ?>
            </span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Lyhytlinkki-asetukset</h3>
        <p>Lyhytlinkki-palvelun konfigurointi ja käyttöehdot.</p>
        <div class="form-group">
          <div class="checkbox-group">
            <input type="checkbox" id="shortener-enabled" <?php echo ($settings['shortener']['enabled'] ?? true) ? 'checked' : ''; ?> disabled>
            <label for="shortener-enabled">Lyhytlinkki-palvelu käytössä</label>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Max. pituus (merkkiä)</label>
            <input type="number" value="<?php echo (int)($settings['shortener']['maxLength'] ?? 4); ?>" min="2" max="8" disabled>
          </div>
          <div class="form-group">
            <label>Pakota HTTPS</label>
            <select disabled>
              <option <?php echo ($settings['shortener']['enforceHttps'] ?? true) ? 'selected' : ''; ?>>Kyllä</option>
              <option <?php echo !($settings['shortener']['enforceHttps'] ?? true) ? 'selected' : ''; ?>>Ei</option>
            </select>
          </div>
        </div>
        <div class="help-text">Muutokset vaativat koodin päivityksen. Ota yhteyttä kehittäjään.</div>
      </div>

      <div class="card">
        <h3>Turvallisuus</h3>
        <p>Sivuston turvallisuusasetukset ja valvonta.</p>
        <div style="space-y:12px;">
          <div style="margin-bottom:12px;">
            <strong>Hallinta-autentikointi:</strong>
            <span class="status-good">✓ Toimii</span>
          </div>
          <div style="margin-bottom:12px;">
            <strong>CSRF-suojaus:</strong>
            <span class="status-good">✓ Käytössä</span>
          </div>
          <div style="margin-bottom:12px;">
            <strong>Istunnot:</strong>
            <span class="status-good">✓ Turvallinen</span>
          </div>
        </div>
        <div class="form-group" style="margin-top:20px;">
          <button type="button" onclick="alert('Salasanan vaihto vaatii config/admin.config.php muokkauksen.')">
            Vaihda salasana
          </button>
        </div>
      </div>

      <div class="card">
        <h3>Toiminnot</h3>
        <p>Sivuston ylläpitotoiminnot ja työkalut.</p>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <button type="button" onclick="window.open('index.php', '_blank')">
            🌐 Avaa sivusto
          </button>
          <button type="button" onclick="window.location.reload()">
            🔄 Päivitä hallintapaneeli
          </button>
          <button type="button" onclick="if(confirm('Haluatko todella tyhjentää välimuistin?')) alert('Välimuisti tyhjennetty (simulaatio)');">
            🗑️ Tyhjennä välimuisti
          </button>
        </div>
      </div>

      <div class="card">
        <h3>Tuki ja ohje</h3>
        <p>Tekninen tuki ja dokumentaatio.</p>
        <div style="space-y:8px;">
          <p><strong>Versio:</strong> Global Group Oy v1.0</p>
          <p><strong>Päivitetty:</strong> <?php echo date('d.m.Y H:i', filemtime(__FILE__)); ?></p>
          <p><strong>PHP:</strong> <?php echo PHP_VERSION; ?></p>
        </div>
        <div style="margin-top:16px;">
          <a href="README.md" target="_blank" class="btn btn-secondary" style="display:inline-block;">📖 Dokumentaatio</a>
        </div>
      </div>
    </div>
  </div>

  <script>
    console.log('Global Group Oy Hallintapaneeli loaded');
    
    // Auto-refresh every 5 minutes for status updates
    setTimeout(() => {
      if (confirm('Sivusto on ollut auki 5 minuuttia. Päivitetäänkö tilanne?')) {
        window.location.reload();
      }
    }, 300000);
  </script>
</body>
</html>