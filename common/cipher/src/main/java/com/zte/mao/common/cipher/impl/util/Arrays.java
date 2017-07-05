package com.zte.mao.common.cipher.impl.util;

/**
 * General array utilities.
 */
public final class Arrays
{
    private Arrays() 
    {
        // static class, hide constructor
    }
    
    /**
     * Determine if two arrays are equal
     * @param a
     * @param b
     * @return
     */
    public static boolean areEqual(
        boolean[]  a,
        boolean[]  b)
    {
        if (a == b)
        {
            return true;
        }

        if (a == null || b == null)
        {
            return false;
        }

        if (a.length != b.length)
        {
            return false;
        }

        for (int i = 0; i != a.length; i++)
        {
            if (a[i] != b[i])
            {
                return false;
            }
        }

        return true;
    }
    /**
     * Determine if two arrays are equal
     * @param a
     * @param b
     * @return
     */
    public static boolean areEqual(
        byte[]  a,
        byte[]  b)
    {
        if (a == b)
        {
            return true;
        }

        if (a == null || b == null)
        {
            return false;
        }

        if (a.length != b.length)
        {
            return false;
        }

        for (int i = 0; i != a.length; i++)
        {
            if (a[i] != b[i])
            {
                return false;
            }
        }

        return true;
    }

    /**
     * A constant time equals comparison - does not terminate early if
     * test will fail.
     *
     * @param a first array
     * @param b second array
     * @return true if arrays equal, false otherwise.
     */
    public static boolean constantTimeAreEqual(
        byte[]  a,
        byte[]  b)
    {
        if (a == b)
        {
            return true;
        }

        if (a == null || b == null)
        {
            return false;
        }

        if (a.length != b.length)
        {
            return false;
        }

        int nonEqual = 0;

        for (int i = 0; i != a.length; i++)
        {
            nonEqual |= (a[i] ^ b[i]);
        }

        return nonEqual == 0;
    }

    /**
     * Determine if two arrays are equal
     * @param a
     * @param b
     * @return
     */
    public static boolean areEqual(
        int[]  a,
        int[]  b)
    {
        if (a == b)
        {
            return true;
        }

        if (a == null || b == null)
        {
            return false;
        }

        if (a.length != b.length)
        {
            return false;
        }

        for (int i = 0; i != a.length; i++)
        {
            if (a[i] != b[i])
            {
                return false;
            }
        }

        return true;
    }
	/**
	 * Assigns the specified byte value to each element of the specified array of bytes.
	 * @param array The array to be filled
	 * @param value The value to be stored in all elements of the array
	 */
    public static void fill(
        byte[] array,
        byte value)
    {
        if (array == null)
        {
            return ;
        }
        for (int i = 0; i < array.length; i++)
        {
            array[i] = value;
        }
    }
    
    /**
     * User can ensure byte array data is properly zeroized by calling this method.
     * @param array The array to be filled with zero.
     */
    public static void zeroization(byte[] array)
    {
    	fill(array, (byte)0);
    }
    
    public static boolean isZeroized(byte[] array){
    	if (array == null)
    		return true;
    	
    	for (int i=0; i<array.length; i++){
    		if (array[i] != 0){
    			return false;
    		}
    	}
    	
    	return true;
    }
    
    /*
    public static void fill(
        long[] array,
        long value)
    {
        if (array == null)
        {
            return ;
        }
    	for (int i = 0; i < array.length; i++)
        {
            array[i] = value;
        }
    }

    public static void fill(
        short[] array, 
        short value)
    {
        if (array == null)
        {
            return ;
        }
        for (int i = 0; i < array.length; i++)
        {
            array[i] = value;
        }
    }
*/
    /*
    public static int hashCode(byte[] data)
    {
        if (data == null)
        {
            return 0;
        }

        int i = data.length;
        int hc = i + 1;

        while (--i >= 0)
        {
            hc *= 257;
            hc ^= data[i];
        }

        return hc;
    }
*/
    /**
     * Creates and returns a copy of byte array.
     * @param data A byte array to clone
     * @return A clone of byte array
     */
    public static byte[] clone(byte[] data)
    {
        if (data == null)
        {
            return null;
        }
        byte[] copy = new byte[data.length];

        System.arraycopy(data, 0, copy, 0, data.length);

        return copy;
    }
/*    public static int[] clone(int[] data)
    {
        if (data == null)
        {
            return null;
        }
        int[] copy = new int[data.length];

        System.arraycopy(data, 0, copy, 0, data.length);

        return copy;
    }*/
    
    public static void main(String[] a){
    	byte[] d = {1,2,3};
    	byte[] b = {0,0,0,0,0};
    	
    	System.out.println(isZeroized(d));
    	System.out.println(isZeroized(b));
    }
}
