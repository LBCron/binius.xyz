{
  description = "Dev shell for the binius.xyz site (Node + Playwright browsers)";

  inputs = {
    nixpkgs.url = "https://channels.nixos.org/nixos-26.05/nixexprs.tar.zst";
  };

  outputs = inputs: {
    devShells = builtins.mapAttrs (system: pkgs: {
      default = pkgs.mkShell {
        packages = [ pkgs.nodejs_24 ];
        # Browsers come from nix; @playwright/test in package.json must match
        # the playwright-driver version (pinned to exactly that version).
        PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";
        PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";
      };
    }) inputs.nixpkgs.legacyPackages;
  };
}
