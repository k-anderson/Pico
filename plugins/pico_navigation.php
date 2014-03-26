<?php
/**
 *
 *
 * @author Karl Anderson
 * @link
 * @license http://opensource.org/licenses/MIT
 */
class Pico_Navigation {
	private $url_paths = array();
	private $hierarchy = array();
	private $pages;

	public function __construct(){
	}

	public function request_url(&$url) {
		$this->url_paths = $this->parse_paths($url);
	}
	
	public function before_read_file_meta(&$headers) {
		$headers['weight'] = 'Weight';
	}	

	public function get_page_data(&$data, $page_meta) {
		$data['weight'] = $page_meta['weight'];
	}
	
	public function get_pages(&$pages, &$current_page, &$prev_page, &$next_page) {
		foreach($pages as $index => $page) {
			if ($page['url'] === $current_page['url']) {
				$pages[$index]['active'] = true;
			}
			$this->add_to_hierarchy($index, $page);
		}
		
		$this->pages = &$pages;
		
		$this->sort_hierarchy();
	}

	public function before_render(&$twig_vars, &$twig, &$template) {
		$twig_vars['hierarchy'] = array(
			'tree' => $this->hierarchy,
			'ancestors' => array(),
			'siblings' => array(),
			'children' => array(),
			'parent' => NULL,
			'self' => NULL
		);
		$this->extract_tree($twig_vars);
	}
	
	private function extract_tree(&$twig_vars, $paths = NULL, $hierarchy = NULL) {		
		if (is_null($paths)) {
			$paths = $this->url_paths;
		}
		
		if (is_null($hierarchy)) {
			$hierarchy = $this->hierarchy;
		}
		
		if (isset($hierarchy['page_index'])) {
			$twig_vars['hierarchy']['ancestors'][] = $hierarchy['page_index'];
		}	
		
		$path = array_shift($paths);
		if (!count($paths)) {
			if (isset($hierarchy['nodes'][$path])) {			
				$self = $hierarchy['nodes'][$path];
				$twig_vars['hierarchy']['self'] = $self['page_index'];
			} else {
				$self = array(
					'page_index' => NULL,
					'weight' => NULL,
					'nodes' => array()
				);
			}
			
			if (isset($hierarchy['page_index'])) {
				$twig_vars['hierarchy']['parent'] = $hierarchy['page_index'];
			} else {
				$twig_vars['hierarchy']['parent'] = null;
			}
			
			if (isset($hierarchy['nodes'])) {
				foreach($hierarchy['nodes'] as $node) { 
					if ($self['page_index'] == $node['page_index']) {
						continue;
					}
					$twig_vars['hierarchy']['siblings'][] = $node['page_index'];
				}
			}

			if (isset($self['nodes'])) {
				foreach($self['nodes'] as $node) { 
					$twig_vars['hierarchy']['children'][] = $node['page_index'];
				}
			}				
			return true;		
		}
		
		$this->extract_tree($twig_vars, $paths, $hierarchy['nodes'][$path]);
	}
	
	private function add_to_hierarchy($index, $page) {
		$paths = $this->parse_paths($page['url']);	
		$hierarchy = &$this->hierarchy;
		
		foreach ($paths as $path) {
			$hierarchy = &$hierarchy['nodes'][$path];
		}
		
		$hierarchy['page_index'] = $index;
		$hierarchy['weight'] = $page['weight'];
	}
	
	private function sort_hierarchy(&$hierarchy = NULL) {
		if (is_null($hierarchy)) {
			$hierarchy = &$this->hierarchy;
		}
		
		if (!isset($hierarchy['nodes'])) {
			return true;
		}
		
		$ordered = array();
		$unordered = array();
		foreach($hierarchy['nodes'] as $path => $node) {
			if (isset($node['nodes'])) {
				$this->sort_hierarchy($node['nodes']);
			}
			
			if (isset($node['weight'])) {
				$ordered[$path] = $node;
			} else {
				$unordered[$path] = $node;
			}			
		}
		
		uasort($ordered, array($this, 'uasort_callback'));
		$hierarchy['nodes'] = array_merge($ordered, $unordered);
		
		return true;	
	}
	
	private function uasort_callback($a, $b) {
		return $b['weight'] - $a['weight'];
	}
	
	private function parse_paths($url) {
		$paths = parse_url($url, PHP_URL_PATH);
		return array_filter(explode('/', $paths));
	}
}
