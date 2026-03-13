<?php

declare(strict_types = 1);

namespace CSSClassManager;

use JsonSerializable;

/**
 * Represents a class preset.
 */
class ClassPreset implements JsonSerializable
{
	/**
	 * The name of the preset.
	 */
	private string $name;

	/**
	 * A brief description of the preset.
	 */
	private ?string $description;

	/**
	 * Indicates if the preset is dynamic.
	 */
	private ?bool $is_dynamic;

	/**
	 * Priority of the preset. Higher priority presets will
	 * show up in the dropdown first.
	 */
	private int $priority = 0;

	/**
	 * ClassPreset constructor.
	 *
	 * @param  string $name        The name of the preset.
	 * @param  string $description A brief description of the preset.
	 * @param  bool   $is_dynamic   Indicates if the preset is dynamic.
	 * @param  int    $priority     The priority of the preset.
	 */
	public function __construct(
		string $name,
		?string $description = null,
		?bool $is_dynamic = null,
		int $priority = 0
	)
	{
		$this->name        = $name;
		$this->description = $description;
		$this->is_dynamic  = $is_dynamic;
		$this->priority    = absint( $priority );
	}

	/**
	 * Get the name of the preset.
	 */
	public function get_name(): string
	{
		return $this->name;
	}

	/**
	 * Prepares the object for JSON serialization.
	 *
	 * @return array{name: string, description?: string, isDynamic?: bool, priority?: int}
	 */
	public function jsonSerialize(): array
	{
		$preset = [
			'name'     => $this->name,
			'priority' => $this->priority,
		];

		if ( $this->description !== null ) {
			$preset['description'] = $this->description;
		}

		if ( $this->is_dynamic !== null ) {
			$preset['isDynamic'] = $this->is_dynamic;
		}

		return $preset;
	}
}
