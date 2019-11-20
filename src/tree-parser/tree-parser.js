import uuidv4 from 'uuid/v4';

class TreeParser {
  /**
   * Replaces a target within the tree.
   * @param {Object} root - The root of the tree.
   * @param {string} target - The target identifier.
   * @param {Object} replacement - The replacement node.
   */
  static replace(root, target, replacement) {
    const tree = {};

    Object.keys(root).forEach((node) => {
      tree[node] = TreeParser.replaceNode(root[node], target, replacement);
    });

    return { root: tree };
  }

  /**
   * Replaces a node within a tree.
   * @param {Object} node - The current node.
   * @param {string} target - The target identifier.
   * @param {Object} replacement - The replacement node.
   */
  static replaceNode(node, target, replacement) {
    const { id, parent, props } = node;

    if (id === target) {
      return TreeParser.clone(replacement, parent, id);
    }

    const properties = {};

    Object.keys(props).forEach((property) => {
      const { type, value } = props[property];

      if (type === 'element') {
        properties[property] = { type, value: TreeParser.replaceNode(value, target, replacement) };
      } else if (type === 'node') {
        const nodes = {};

        Object.keys(value).forEach((key) => {
          nodes[key] = TreeParser.replaceNode(value[key], target, replacement);
        });

        properties[property] = { type, value: nodes };
      } else {
        properties[property] = props[property];
      }
    });

    return { ...node, props: properties };
  }

  /**
   * Clones a provided node.
   * @param {Object} node - The node to clone.
   * @param {string} parent - Optional parent identifier to assign the node.
   * @param {string} identifier - Optional identifier to assign the node.
   */
  static clone(node, parent, identifier) {
    const id = identifier || uuidv4();

    const { name, props } = node;

    const properties = {};

    Object.keys(props).forEach((prop) => {
      const { type, value } = props[prop];

      if (type === 'element') {
        properties[prop] = { type, value: TreeParser.clone(value, id) };
      } else if (type === 'node') {
        const nodes = {};

        Object.keys(value).forEach((key) => {
          nodes[key] = TreeParser.clone(value[key], id);
        });

        properties[prop] = { type, value: nodes };
      } else {
        properties[prop] = props[prop];
      }
    });

    return {
      id,
      name,
      parent,
      type: 'element',
      props: properties,
    };
  }
}

export default TreeParser;