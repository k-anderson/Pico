<?php
/**
 *
 *
 * @author Karl Anderson
 * @link
 * @license http://opensource.org/licenses/MIT
 */
class Pico_Editor {
	private $is_editable = false;
	private $filename = NULL;
	private $content = NULL;
	private $url_paths = array();
	private $plugin_path;
	
	public function __construct() {
		$this->plugin_path = dirname(__FILE__);
	}
	public function after_load_content(&$file, &$content) {
		$this->filename = $file;
		$this->content = $content;
	}
	
	public function request_url(&$url) {
		chdir('content/');		
		if (is_file($url . ".md")) {
			$this->is_editable = true;
			$this->filename = $url . ".md";
		} else {
			$this->is_editable = false;
		}		
	}
	
	public function before_render(&$twig_vars, &$twig, &$template) {
		//if ($this->is_editable) {
		//	$loader = new Twig_Loader_Filesystem($this->plugin_path);
		//	$twig_editor = new Twig_Environment($loader, $twig_vars);
		//}
		$twig_vars['editor']['is_editable'] = $this->is_editable;
		$twig_vars['editor']['filename'] = $this->filename;
		$twig_vars['editor']['content'] = $this->content;
	}
}