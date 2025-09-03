# CSS Class Manager

An advanced autocomplete additional css class control for your blocks

## Description

Struggling with adding multiple CSS classes to your WordPress blocks? CSS Class Manager simplifies the process with autocomplete suggestions and a dedicated manager for adding, editing, and organizing your classes. Boost your block styling efficiency!

There are two main motivations behind creating this plugins:

**Limitation of Block Style** - When applying a block style, only one CSS class can be added to a block. Unfortunately, the block editor lacks the ability to select multiple block styles. To address this, users must resort to the Additional CSS Class(es) inspector control to apply multiple classes. CSS Class Manager provides a powerful manager and an autocomplete inspector control, enabling users to easily add and apply CSS classes to their blocks.

**Poor UX of the Addional CSS Class(es) control** - The default control for adding class names is a simple text input. This can be cumbersome, especially when applying CSS classes frequently. With the custom inspector control provided by CSS Class Manager, users can effortlessly add their class names, enhancing the user experience.

## Features

- **Advanced Autocomplete Control:** Streamline block styling with autocomplete functionality for CSS classes.
- **Effortless Class Management:** Easily add, edit, or remove CSS classes directly within the manager interface.
- **Show the control in its own panel:** User specific settings to show the Addional CSS Class(es) control in its own panel.
- **Import and Export:** Seamlessly transfer custom CSS class names to ensure consistency across projects.

## Getting Started

1. Activate the plugin within your WordPress setup.
2. The advanced control will replace the default "Additional CSS Class(es)" and can be found in the "Advance" block settings section.
3. Adding and selecting classes in the autocomplete field is similar to the tags and categories fields.
4. To edit and manage class names, click the "Open Class Manager" link or select "CSS Class Manager" from the More Menu.
5. Import/Export can be done from the manager modal.
6. Use `css_class_manager_filtered_class_names` filter to add class names with PHP files.

## Screenshots

1. The advanced inspector control is located in the Advanced block settings section.
	![Advanced inspector control](.wp-org/screenshot-1.png)

2. Multi-select tag like input control instead of plain text field.
	![Multi-select input](.wp-org/screenshot-2.png)

3. Add body classes to your posts, pages or custom post types with the Body Classes control located in the Post Tab in the post editor.
	![Body classes control](.wp-org/screenshot-3.png)

4. Fuzzy searching with fuse.js.
	![Fuzzy searching](.wp-org/screenshot-4.png)

5. You can add your CSS classes and their descriptions in the CSS Class Manager modal.
	![Add CSS classes](.wp-org/screenshot-5.png)

6. Edit your CSS classes and their descriptions in the CSS Class Manager modal.
	![Edit CSS classes](.wp-org/screenshot-6.png)

7. User-specific settings for the plugin.
	![User settings](.wp-org/screenshot-7.png)

8. Import or export your classes right from the manager modal.
	![Import/Export](.wp-org/screenshot-8.png)

## Frequently Asked Questions

### How to open the manager modal?
Under the Additional CSS Class(es) control, you will see a link says Open Class Manager. Click on that to open the CSS Class Manager preferences modal.

### How to use the PHP filter?
Use the `css_class_manager_filtered_class_names` filter to add your class names from your plugin or theme. Check out the example code in this [wiki page](https://github.com/ediamin/css-class-manager/wiki#how-to-use-the-php-filter) for more details.

## Requirements

- WordPress 6.6 or higher.
- PHP 7.4 or higher.

## License

GPL-3.0 License - [https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html)
