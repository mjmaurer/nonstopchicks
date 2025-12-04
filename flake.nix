{
  inputs = {
    # nixpkgs.url = "github:NixOS/nixpkgs/24.11";
    # nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    # Arbitrary NixOS_24.11 April 23, 2025
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
    # Arbitrary mainline / unstable April 23, 2025:
    # nixpkgs.url = "github:NixOS/nixpkgs/835524c6ef2d5e91fa7820f6e81b3751f1154fc3";
    flake-utils.url = "github:numtide/flake-utils";
    # Arbitrary mainline April 23, 2025:
    # Run `cachix use nixpkgs-python` to avoid re-build
    # nixpkgs-python.url = "github:cachix/nixpkgs-python/40d2237867f219de1c1362e3d067a1673afa5f82";
  };
  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        node = {
          packages = with pkgs; [
            nodejs_22
            yarn
            corepack
            git
            curl
            jq
          ];
          readme = ''
            Helper commands:
            - lint: run Biome
            - format: format with Biome
            - typecheck: TypeScript type check
            - check: typecheck + lint
            - yt-env: verify YOUTUBE_API_KEY is configured
            - cache-clear: remove server cache file
          '';
        };
        package = node;
        readme = pkgs.writeText "readme" ''
          # Commands

          Some command description:
          ```zsh
          command
          ```

          ${package.readme}
        '';
      in
      with pkgs;
      {
        devShells.default = mkShell {
          buildInputs =
            with pkgs;
            [
              (writeShellScriptBin "typecheck" ''
                set -euo pipefail
                if npm run -s typecheck >/dev/null 2>&1; then
                  npm run typecheck
                else
                  npx tsc -p .
                fi
              '')
              (writeShellScriptBin "lint" ''
                set -euo pipefail
                if npm run -s lint >/dev/null 2>&1; then
                  npm run lint
                else
                  npx @biomejs/biome check .
                fi
              '')
              (writeShellScriptBin "format" ''
                set -euo pipefail
                if npm run -s format >/dev/null 2>&1; then
                  npm run format
                else
                  npx @biomejs/biome format --write .
                fi
              '')
              (writeShellScriptBin "check" ''
                set -euo pipefail
                typecheck
                lint
              '')
              (writeShellScriptBin "yt-env" ''
                set -euo pipefail
                if [ -z "''${YOUTUBE_API_KEY:-}" ]; then
                  echo "YOUTUBE_API_KEY is not set" >&2
                  exit 1
                else
                  echo "YOUTUBE_API_KEY is set"
                fi
              '')
              (writeShellScriptBin "cache-clear" ''
                set -euo pipefail
                rm -f server-cache/youtube-data.json
                echo "Cleared server-cache/youtube-data.json"
              '')
            ]
            ++ package.packages;
          shellHook = ''
            if [ -t 0 ]; then
              ${pkgs.glow}/bin/glow ${readme}
            fi
          '';
        };
      }
    );
}
