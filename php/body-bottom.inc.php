<!--[if lte IE 8]>
<link href="<?php echo $tmpl_url; ?>/css/ie8-alert.css" rel="stylesheet" />
<div class="ie8-alert">You are using an unsupported version of Internet Explorer. To ensure security, performance, and full functionality, <a href="http://browsehappy.com/?locale=<?php echo $this->language; ?>" target="_blank">please upgrade to an up-to-date browser.</a></div>
<![endif]-->

<?php echo $this->params->get('disqus_shortname') ? '<script src="//' . $this->params->get('disqus_shortname') . '.disqus.com/embed.js"></script>' : ''; ?>

<jdoc:include type="modules" name="body" />