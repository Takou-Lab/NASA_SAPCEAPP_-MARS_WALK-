#!/usr/bin/env python3
"""
Fetch data tool for MARSWALK data preparation.
Downloads an asset from a validated HTTPS URL to a local destination.
"""
import argparse
import os
import sys
import urllib.request
import urllib.parse

def fetch_file(url: str, output_path: str, force: bool = False) -> None:
    # Validate URL
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != 'https':
        raise ValueError(f"URL must use HTTPS: {url}")
    
    if os.path.exists(output_path) and not force:
        print(f"Target already exists (use --force to overwrite): {output_path}")
        return

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    temp_path = output_path + ".tmp"
    
    print(f"Downloading {url} -> {output_path}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'MARSWALK-DataPrep/1.0'})
    with urllib.request.urlopen(req) as resp, open(temp_path, 'wb') as f:
        total = resp.headers.get('Content-Length')
        total = int(total) if total else None
        downloaded = 0
        chunk_size = 65536
        while True:
            chunk = resp.read(chunk_size)
            if not chunk:
                break
            f.write(chunk)
            downloaded += len(chunk)
            if total:
                percent = downloaded / total * 100
                sys.stdout.write(f"\r  {downloaded:,} / {total:,} bytes ({percent:.1f}%)")
            else:
                sys.stdout.write(f"\r  {downloaded:,} bytes")
            sys.stdout.flush()
        print()
    
    os.replace(temp_path, output_path)
    print(f"Downloaded successfully: {output_path} ({os.path.getsize(output_path):,} bytes)")

def main():
    parser = argparse.ArgumentParser(description="Fetch MARSWALK data from authoritative HTTPS URL.")
    parser.add_argument("--url", required=True, help="HTTPS source URL")
    parser.add_argument("--output", required=True, help="Output destination file path")
    parser.add_argument("--force", action="store_true", help="Force overwrite existing file")
    args = parser.parse_args()

    fetch_file(args.url, args.output, args.force)

if __name__ == "__main__":
    main()

