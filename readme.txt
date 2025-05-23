=== CSS Class Manager - An advanced autocomplete additional css class control for your blocks  ===
Contributors: ediamin
Tags: gutenberg, editor, dropdown, styles, multiple
Requires at least: 6.6
Tested up to: 6.8.1
Requires PHP: 7.4
Stable tag: 1.3.0
License: GPL-3.0
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Empower block editing with advanced CSS autocomplete in CSS Class Manager.

== Description ==

Struggling with adding multiple CSS classes to your WordPress blocks? CSS Class Manager simplifies the process with autocomplete suggestions and a dedicated manager for adding, editing, and organizing your classes. Boost your block styling efficiency!

There are two main motivations behind creating this plugins:
**Limitation of Block Style** - When applying a block style, only one CSS class can be added to a block. Unfortunately, the block editor lacks the ability to select multiple block styles. To address this, users must resort to the Additional CSS Class(es) inspector control to apply multiple classes. CSS Class Manager provides a powerful manager and an autocomplete inspector control, enabling users to easily add and apply CSS classes to their blocks.
**Poor UX of the Addional CSS Class(es) control** - The default control for adding class names is a simple text input. This can be cumbersome, especially when applying CSS classes frequently. With the custom inspector control provided by CSS Class Manager, users can effortlessly add their class names, enhancing the user experience.

== Features ==

- **Advanced Autocomplete Control:** Streamline block styling with autocomplete functionality for CSS classes.
- **Effortless Class Management:** Easily add, edit, or remove CSS classes directly within the manager interface.
- **Show the control in its own panel:** User specific settings to show the Addional CSS Class(es) control in its own panel.
- **Import and Export:** Seamlessly transfer custom CSS class names to ensure consistency across projects.

== Getting Started ==

1. Activate the plugin within your WordPress setup.
2. The advanced control will replace the default "Additional CSS Class(es)" and can be found in the "Advance" block settings section.
3. Adding and selecting classes in the autocomplete field is similar to the tags and categories fields.
4. To edit and manage class names, click the "Open Class Manager" link or select "CSS Class Manager" from the More Menu.
5. Import/Export can be done from the manager modal.
6. Use `css_class_manager_filtered_class_names` filter to add class names with PHP files.


== Screenshots ==

1. The advanced inspector control is located in the Advanced block settings section.
2. Multi-select tag like input control instead of plain text field.
3. The CSS Class Manager preference modal window.
4. The class names saved in the class list will show up in the control dropdown.
5. Delete saved class name so they won't show in the dropdown anymore.
6. User settings to show the control in its own panel.
7. Import or export your class list.

== Frequently Asked Questions ==

= Where can I find the JavaScript and CSS non-compiled source files? =

Please checkout the [GitHub repository](https://github.com/ediamin/css-class-manager) of this plugin to see the sources.

= How to open the manager modal? =

Under the Additional CSS Class(es) control, you will see a link says Open Class Manager. Click on that to open the CSS Class Manager preferences modal.

= How to use the PHP filter? =

Use the `css_class_manager_filtered_class_names` filter to add your class names from your plugin or theme. Check out the example code in this [GitHub wiki page](https://github.com/ediamin/css-class-manager/wiki#how-to-use-the-php-filter) for more details.


== Changelog ==

= 1.3.0 - May 24, 2025 =
* Implement fuzzy search with fuse.js.
* Fix overlapping typography sizes onto class list dropdown.

= 1.2.1 - January 26, 2025 =
* Improved the determination of control groups for own panel settings.

= 1.2.0 - January 17, 2025 =
* Add user preference to display the control in its own panel.

= 1.1.0 - November 16, 2024 =
* Allow colon in class names.
* Fix preference modal tab background color.
* Bump the minimum WordPress version requirement to 6.6 from 6.5.
* Import PluginMoreMenuItem from wp-editor package.
* Update scss file and use the @use instead of @import.
* Upgrade the npm packages to the latest.

= 1.0.0 - May 25, 2024 =
* Initial release.
