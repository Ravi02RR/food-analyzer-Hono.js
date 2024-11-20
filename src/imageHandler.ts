//@ts-ignore
export async function handleMultipartForm(formData: FormData): Promise<{ base64: string; mimeType: string }> {
  //@ts-ignore  
  const foodImage = formData.get('foodImage') as File | null;
    
    if (!foodImage) {
      throw new Error('No image file uploaded');
    }
  
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(foodImage.type)) {
      throw new Error('Only .png, .jpg and .jpeg format allowed!');
    }
  
    const maxSize = 10 * 1024 * 1024; 
    if (foodImage.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }
  
    const arrayBuffer = await foodImage.arrayBuffer();
    return {
      //@ts-ignore
      base64: Buffer.from(arrayBuffer).toString('base64'),
      mimeType: foodImage.type
    };
  }
  