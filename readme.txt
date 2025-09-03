=== CSS Class Manager - An advanced autocomplete additional css class control for your blocks  ===
Contributors: ediamin
Tags: gutenberg, editor, dropdown, styles, multiple
Requires at least: 6.6
Tested up to: 6.8.2
Requires PHP: 7.4
Stable tag: 1.4.2
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
- **Body and Post Classes:** Add custom class names to post body and post containers using body_class and post_class filters directly from the post editor.
- **Theme.json Integration:** Automatically include global class names generated from theme.json settings in your class suggestions.
- **Show the control in its own panel:** User specific settings to show the Addional CSS Class(es) control in its own panel.
- **Import and Export:** Seamlessly transfer custom CSS class names to ensure consistency across projects.

== Getting Started ==

1. Activate the plugin within your WordPress setup.
2. The advanced control will replace the default "Additional CSS Class(es)" and can be found in the "Advance" block settings section.
3. Adding and selecting classes in the autocomplete field is similar to the tags and categories fields.
4. To add body or post classes, look for the "Body Classes" and "Post Classes" controls in the Post tab of the post editor (requires custom-fields support). [See the limitations](https://github.com/ediamin/css-class-manager/wiki/Known-Issues#body-classes-preview-in-block-editor)
5. To edit and manage class names, click the "Open Class Manager" link or select "CSS Class Manager" from the More Menu.
6. Import/Export can be done from the manager modal.
7. Theme.json generated classes are automatically included and can be disabled from the Preferences in the manager modal.
8. Use `css_class_manager_filtered_class_names` filter to add class names with PHP files.


== Screenshots ==

1. The advanced inspector control is located in the Advanced block settings section.
2. Multi-select tag like input control instead of plain text field.
3. Add body classes to your posts, pages or custom post types with the Body Classes control located in the Post Tab in the post editor.
4. Fuzzy searching with fuse.js.
5. You can add your CSS classes and their descriptions in the CSS Class Manager modal.
6. Edit your CSS classes and their descriptions in the CSS Class Manager modal.
7. User-specific settings for the plugin.
8. Import or export your classes right from the manager modal.

== Frequently Asked Questions ==

= Where can I find the JavaScript and CSS non-compiled source files? =

Please checkout the [GitHub repository](https://github.com/ediamin/css-class-manager) of this plugin to see the sources.

= How to open the manager modal? =

Under the Additional CSS Class(es) control, you will see a link says Open Class Manager. Click on that to open the CSS Class Manager preferences modal.

= How do the Body Classes and Post Classes work? =

The Body Classes control adds class names to the post's body element using WordPress's body_class filter, while Post Classes adds them to post containers using the post_class filter. These controls are available in the Post tab of the post editor and require the post type to support custom-fields.

= Can I disable theme.json generated classes? =

Yes, you can disable theme.json generated class names from appearing in the dropdown by adjusting the preferences in the CSS Class Manager modal.

= How to use the PHP filter? =

Use the `css_class_manager_filtered_class_names` filter to add your class names from your plugin or theme. Check out the example code in this [GitHub wiki page](https://github.com/ediamin/css-class-manager/wiki#how-to-use-the-php-filter) for more details.


== Changelog ==

= 1.4.2 - September 03, 2025 =
* Fix broken theme class generator when css contains line breaks.

= 1.4.1 - September 03, 2025 =
* Fix body classes not adding in pages.

= 1.4.0 - September 03, 2025 =
* Add Body Classes and Post Classes controls to the post editor for managing body_class and post_class filters.
* Integrate theme.json generated class names into the class suggestions dropdown.
* Add preference option to disable theme.json classes from appearing in suggestions.

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
