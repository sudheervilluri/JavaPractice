import java.util.HashMap;

public class LRUCache {
	static class Node{
	    int key;
	    int value;
	    Node pre;
	    Node next;
	 
	    public Node(int key, int value){
	        this.key = key;
	        this.value = value;
	    }
	}
	int capacity;
    HashMap<Integer, Node> map = new HashMap<Integer, Node>();
    static Node head=null;
    Node end=null;
 
    public LRUCache(int capacity) {
        this.capacity = capacity;
    }
 
    public int get(int key) {
        if(map.containsKey(key)){
            Node n = map.get(key);
            remove(n);
            setHead(n);
            return n.value;
        }
 
        return -1;
    }
 
    public void remove(Node n){
        if(n.pre!=null){
            n.pre.next = n.next;
        }else{
            head = n.next;
        }
 
        if(n.next!=null){
            n.next.pre = n.pre;
        }else{
            end = n.pre;
        }
 
    }
 
    public void setHead(Node n){
        n.next = head;
        n.pre = null;
 
        if(head!=null)
            head.pre = n;
 
        head = n;
 
        if(end ==null)
            end = head;
    }
 
    public void set(int key, int value) {
        if(map.containsKey(key)){
            Node old = map.get(key);
            old.value = value;
            remove(old);
            setHead(old);
        }else{
            Node created = new Node(key, value);
            if(map.size()>=capacity){
                map.remove(end.key);
                remove(end);
                setHead(created);
 
            }else{
                setHead(created);
            }    
 
            map.put(key, created);
        }
    }
    private void addLast(Node node) {
		if(head==null) {
			head = node;
		}else {
			Node temp = head;
			while(temp.next!=null) {
				temp = temp.next;
			}
				temp.next = node;
			
		}
	}
    public void printList(Node head) {
		Node temp = head;
		while (temp != null) {
			System.out.print(temp.value);
			temp = temp.next;
		}
		System.out.println();
	}
    public static void main(String[] args) {
		LRUCache l = new LRUCache(3);
		l.set(1, 1);
		l.set(2, 3);
		l.set(4, 3);
		l.set(3, 4);
		l.set(6, 5);
		l.printList(head);
		
	}
}
