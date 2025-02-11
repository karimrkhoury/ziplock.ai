import JSZip from 'jszip';

async function testCompression(file: File, level: number): Promise<number> {
  const zip = new JSZip();
  zip.file(file.name, file, {
    compression: "DEFLATE",
    compressionOptions: { level }
  });
  
  const content = await zip.generateAsync({
    type: 'blob',
    compression: "DEFLATE",
    compressionOptions: { level }
  });
  
  return content.size / file.size;
}

// Test different file types with different compression levels
async function runCompressionTests() {
  const testFiles = [
    new File(['a'.repeat(100000)], 'text.txt', { type: 'text/plain' }),
    // Create a simple PNG
    new File([new Uint8Array(100000)], 'test.png', { type: 'image/png' }),
    // Create a simple PDF-like content
    new File(['%PDF' + 'x'.repeat(100000)], 'test.pdf', { type: 'application/pdf' })
  ];

  for (const file of testFiles) {
    console.log(`Testing ${file.name}:`);
    for (const level of [1, 3, 5, 7, 9]) {
      const ratio = await testCompression(file, level);
      console.log(`Level ${level}: ${(ratio * 100).toFixed(1)}% of original`);
    }
  }
} 