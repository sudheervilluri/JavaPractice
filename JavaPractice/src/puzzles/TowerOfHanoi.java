package puzzles;

import java.util.Collections;

public class TowerOfHanoi {

	
//  Driver method 
    public static void main(String args[]) 
    { 
        int n =3; // Number of disks 
        towerOfHanoi(n, 'A', 'C', 'B');  // A, B and C are names of rods 
    }

	private static void towerOfHanoi(int n, char from_rod, char to_rod, char aux_rod) {
		
		if(n==1) {
			System.out.println("Rod 1 move from to_rod"+to_rod+" from_rod"+from_rod);
			return;
		}
		
		towerOfHanoi(n-1, from_rod, aux_rod, to_rod);
		System.out.println("Rob "+n+"move from to_rod"+to_rod+" from_rod"+from_rod);
		towerOfHanoi(n, from_rod, to_rod, aux_rod);

		Long.toBinaryString(i);
		Long.parseLong(s, radix)
	} 
}




/**
Tower of Hanoi is a mathematical puzzle where we have three rods and n disks. The objective of the puzzle is to move the entire stack to another rod, obeying the following simple rules:
1) Only one disk can be moved at a time.
2) Each move consists of taking the upper disk from one of the stacks and placing it on top of another stack i.e. a disk can only be moved if it is the uppermost disk on a stack.
3) No disk may be placed on top of a smaller disk.
https://www.geeksforgeeks.org/c-program-for-tower-of-hanoi/
**/