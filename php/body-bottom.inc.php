<?php if($this->params->get('ie8_alert',1)): ?>
<!--[if lte IE 8]>
<link href="<?php echo $tmpl_url; ?>/css/ie8-alert.css" rel="stylesheet" />
<div class="ie8-alert">You are using an unsupported version of Internet Explorer. To ensure security, performance, and full functionality, <a href="http://browsehappy.com/?locale=<?php echo $this->language; ?>">please upgrade to an up-to-date browser.</a></div>
<![endif]-->
<?php endif;
if($this->params->get('ie9_alert',1)): ?>
<!--[if IE 9]>
<link href="<?php echo $tmpl_url; ?>/css/ie9-alert.css" rel="stylesheet" />
<div class="ie9-alert">You are using an unsupported version of Internet Explorer. To ensure security, performance, and full functionality, <a href="http://browsehappy.com/?locale=<?php echo $this->language; ?>">please upgrade to an up-to-date browser.</a><i></i></div>
<script>jQuery('.ie9-alert i').click(function(){jQuery('.ie9-alert').hide();});</script>
<![endif]-->
<?php endif;
echo $this->params->get('disqus_shortname') ? '<script src="//' . $this->params->get('disqus_shortname') . '.disqus.com/embed.js"></script>' : ''; ?>

<jdoc:include type="modules" name="body" />