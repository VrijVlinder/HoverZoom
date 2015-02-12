<?php if (!defined('APPLICATION')) exit();
 
$PluginInfo['HoverZoom'] = array(
    'Name' => 'HoverZoom',
    'Description' => 'Allows you to view full size images by hovering the image or image links',
    'Version' => '1.0',
    'MobileFriendly' => FALSE,
    'License'=>"GNU GPL2",
    'Author' => "VrijVlinder"
    );

class HoverZoomPlugin extends Gdn_Plugin {
      
      public function Base_Render_Before($Sender) {
         $Sender->AddJsFile('hover_zoom_extended.js');
         $Sender->AddJsFile('hover_zoom.js');
        
        }
    
      
   
     
    public function Setup() {
    }
}


